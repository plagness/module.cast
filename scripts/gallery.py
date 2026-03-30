#!/usr/bin/env python3
"""
Управление галереей module.cast.
Загружает фотографии в S3, генерирует gallery.ts с метаданными.

Использование:
  # Загрузить все фото из папки, автоматически назначая категорию по имени подпапки
  python3 scripts/gallery.py upload photos/

  # Загрузить в конкретную категорию
  python3 scripts/gallery.py upload photos/ --category studio

  # Сгенерировать gallery.ts из текущего содержимого S3
  python3 scripts/gallery.py sync

  # Список файлов в бакете
  python3 scripts/gallery.py list

Категории: studio, streams, events, equipment
Фото загружаются в S3 как: gallery/{category}/{filename}.webp
Публичный URL: https://modulecast-images.s3.twcstorage.ru/gallery/{category}/{filename}.webp
"""

import os
import sys
import json
import hashlib
import mimetypes
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / '.env')

S3_ENDPOINT = os.getenv('S3_ENDPOINT', 'https://s3.twcstorage.ru')
S3_BUCKET = os.getenv('S3_BUCKET', 'modulecast-images')
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY', '')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY', '')
S3_PUBLIC_URL = os.getenv('S3_PUBLIC_URL', f'https://{S3_BUCKET}.s3.twcstorage.ru')

CATEGORIES = ['studio', 'streams', 'events', 'equipment']
GALLERY_TS = Path(__file__).parent.parent / 'src' / 'data' / 'gallery.ts'
IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.avif'}


def get_s3():
    import boto3
    return boto3.client(
        's3',
        endpoint_url=S3_ENDPOINT,
        aws_access_key_id=S3_ACCESS_KEY,
        aws_secret_access_key=S3_SECRET_KEY,
    )


def upload(source_dir: str, category: str | None = None):
    """Загрузить фотографии из папки в S3."""
    s3 = get_s3()
    source = Path(source_dir)
    uploaded = 0

    for path in sorted(source.rglob('*')):
        if path.suffix.lower() not in IMAGE_EXTS:
            continue

        # Определить категорию из подпапки или аргумента
        cat = category
        if not cat:
            rel = path.relative_to(source)
            if len(rel.parts) > 1:
                folder = rel.parts[0].lower()
                cat = folder if folder in CATEGORIES else 'studio'
            else:
                cat = 'studio'

        key = f'gallery/{cat}/{path.name}'
        content_type = mimetypes.guess_type(str(path))[0] or 'image/jpeg'

        print(f'  uploading {path.name} → s3://{S3_BUCKET}/{key}')
        s3.upload_file(
            str(path), S3_BUCKET, key,
            ExtraArgs={'ContentType': content_type, 'ACL': 'public-read'},
        )
        uploaded += 1

    print(f'\n  {uploaded} файлов загружено')
    print('  Запустите `python3 scripts/gallery.py sync` для обновления gallery.ts')


def list_files():
    """Список файлов в бакете."""
    s3 = get_s3()
    resp = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix='gallery/')
    for obj in resp.get('Contents', []):
        size_kb = obj['Size'] / 1024
        print(f'  {obj["Key"]}  ({size_kb:.0f} KB)')
    print(f'\n  Всего: {resp.get("KeyCount", 0)} файлов')


def sync():
    """Сгенерировать gallery.ts из содержимого S3 бакета."""
    s3 = get_s3()
    resp = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix='gallery/')

    photos = []
    for obj in resp.get('Contents', []):
        key = obj['Key']  # gallery/studio/photo1.webp
        parts = key.split('/')
        if len(parts) != 3:
            continue

        cat = parts[1]
        filename = parts[2]
        name = Path(filename).stem

        if cat not in CATEGORIES:
            continue

        photo_id = hashlib.md5(key.encode()).hexdigest()[:8]
        photos.append({
            'id': photo_id,
            'src': f'{S3_PUBLIC_URL}/{key}',
            'category': cat,
            'alt': name.replace('-', ' ').replace('_', ' ').title(),
        })

    # Сортировка: по категории, затем по alt
    photos.sort(key=lambda p: (CATEGORIES.index(p['category']), p['alt']))

    # Генерация gallery.ts
    ts_lines = [
        "export type GalleryCategory = 'studio' | 'streams' | 'events' | 'equipment'",
        '',
        'export interface GalleryPhoto {',
        '  id: string',
        '  src: string',
        '  category: GalleryCategory',
        '  alt: string',
        '}',
        '',
        'export const categoryLabels: Record<GalleryCategory, string> = {',
        "  studio: 'Студия',",
        "  streams: 'Стримы',",
        "  events: 'Мероприятия',",
        "  equipment: 'Оборудование',",
        '}',
        '',
        'export const photos: GalleryPhoto[] = [',
    ]

    for p in photos:
        ts_lines.append(f"  {{ id: '{p['id']}', src: '{p['src']}', category: '{p['category']}', alt: '{p['alt']}' }},")

    ts_lines.append(']')
    ts_lines.append('')

    GALLERY_TS.write_text('\n'.join(ts_lines))
    print(f'  gallery.ts обновлён: {len(photos)} фото')
    for cat in CATEGORIES:
        count = sum(1 for p in photos if p['category'] == cat)
        if count:
            print(f'    {cat}: {count}')


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    cmd = sys.argv[1]

    if cmd == 'upload':
        if len(sys.argv) < 3:
            print('Использование: gallery.py upload <путь_к_папке> [--category <cat>]')
            return
        source = sys.argv[2]
        cat = None
        if '--category' in sys.argv:
            idx = sys.argv.index('--category')
            cat = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else None
        upload(source, cat)

    elif cmd == 'sync':
        sync()

    elif cmd == 'list':
        list_files()

    else:
        print(f'Неизвестная команда: {cmd}')
        print(__doc__)


if __name__ == '__main__':
    main()
