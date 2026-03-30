#!/usr/bin/env python3
"""
Управление медиа module.cast.
Сжимает видео (HEVC), загружает в S3, генерирует updates.ts.

Использование:
  python3 scripts/media.py compress [--source DIR]   # MOV/MP4 → HEVC MP4
  python3 scripts/media.py upload [--source DIR]      # Загрузить сжатые в S3
  python3 scripts/media.py sync                       # Сгенерировать updates.ts из S3
  python3 scripts/media.py all [--source DIR]         # Всё вместе
"""

import os
import sys
import subprocess
import hashlib
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / '.env')

S3_ENDPOINT = os.getenv('S3_ENDPOINT', 'https://s3.twcstorage.ru')
S3_BUCKET = os.getenv('S3_BUCKET', 'modulecast-images')
S3_ACCESS_KEY = os.getenv('S3_ACCESS_KEY', '')
S3_SECRET_KEY = os.getenv('S3_SECRET_KEY', '')
S3_PUBLIC_URL = os.getenv('S3_PUBLIC_URL', f'https://{S3_BUCKET}.s3.twcstorage.ru')

DEFAULT_SOURCE = '/home/plag/module.media/video'
VIDEO_EXTS = {'.mov', '.mp4', '.avi', '.mkv', '.webm'}
UPDATES_TS = Path(__file__).parent.parent / 'src' / 'data' / 'updates.ts'


def get_s3():
    import boto3
    return boto3.client(
        's3',
        endpoint_url=S3_ENDPOINT,
        aws_access_key_id=S3_ACCESS_KEY,
        aws_secret_access_key=S3_SECRET_KEY,
    )


def compress(source_dir: str):
    """Сжать видео в HEVC."""
    source = Path(source_dir)
    out_dir = source / 'compressed'
    out_dir.mkdir(exist_ok=True)

    videos = sorted(f for f in source.iterdir() if f.suffix.lower() in VIDEO_EXTS and f.is_file())
    if not videos:
        print('  Нет видео для сжатия')
        return

    for v in videos:
        out = out_dir / f'{v.stem}.mp4'
        if out.exists():
            print(f'  пропуск {v.name} (уже сжато)')
            continue

        print(f'  сжатие {v.name} → {out.name} ...')
        cmd = [
            'ffmpeg', '-i', str(v),
            '-c:v', 'libx265', '-preset', 'fast', '-crf', '28',
            '-tag:v', 'hvc1',
            '-c:a', 'aac', '-b:a', '128k',
            '-movflags', '+faststart',
            '-y', str(out),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f'    ОШИБКА: {result.stderr[-200:]}')
        else:
            orig_mb = v.stat().st_size / 1024 / 1024
            new_mb = out.stat().st_size / 1024 / 1024
            print(f'    {orig_mb:.1f}MB → {new_mb:.1f}MB ({new_mb/orig_mb*100:.0f}%)')

    print(f'\n  Сжатые видео: {out_dir}')


def upload(source_dir: str):
    """Загрузить сжатые видео в S3."""
    s3 = get_s3()
    compressed = Path(source_dir) / 'compressed'
    if not compressed.exists():
        print('  Нет папки compressed. Сначала запустите compress.')
        return

    uploaded = 0
    for f in sorted(compressed.glob('*.mp4')):
        key = f'updates/{f.name}'
        print(f'  uploading {f.name} → s3://{S3_BUCKET}/{key}')
        s3.upload_file(
            str(f), S3_BUCKET, key,
            ExtraArgs={'ContentType': 'video/mp4', 'ACL': 'public-read'},
        )
        uploaded += 1

    print(f'\n  {uploaded} видео загружено')


def sync():
    """Сгенерировать updates.ts из S3."""
    s3 = get_s3()
    resp = s3.list_objects_v2(Bucket=S3_BUCKET, Prefix='updates/')

    entries = []
    for obj in resp.get('Contents', []):
        key = obj['Key']
        filename = key.split('/')[-1]
        stem = Path(filename).stem  # '2025-07-30'

        # Определяем тип по расширению
        ext = Path(filename).suffix.lower()
        if ext in ('.mp4', '.mov', '.webm'):
            media_type = 'video'
        elif ext in ('.jpg', '.jpeg', '.png', '.webp'):
            media_type = 'image'
        else:
            continue

        entries.append({
            'id': stem,
            'date': stem,  # дата = имя файла
            'type': media_type,
            'mediaUrl': f'{S3_PUBLIC_URL}/{key}',
        })

    entries.sort(key=lambda e: e['date'], reverse=True)

    # Генерация updates.ts
    lines = [
        "export type MediaType = 'video' | 'youtube' | 'image' | 'text'",
        '',
        'export interface Highlight {',
        '  icon: string',
        '  text: string',
        '}',
        '',
        'export interface UpdateEntry {',
        '  id: string',
        '  date: string',
        '  type: MediaType',
        '  mediaUrl?: string',
        '  tags?: string[]',
        '  highlights?: Highlight[]',
        '}',
        '',
        'export const updates: UpdateEntry[] = [',
    ]

    for e in entries:
        tags_str = ''
        lines.append(f"  {{ id: '{e['id']}', date: '{e['date']}', type: '{e['type']}', mediaUrl: '{e['mediaUrl']}'{tags_str} }},")

    lines.append(']')
    lines.append('')

    UPDATES_TS.write_text('\n'.join(lines))
    print(f'  updates.ts обновлён: {len(entries)} записей')


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return

    cmd = sys.argv[1]
    source = DEFAULT_SOURCE
    if '--source' in sys.argv:
        idx = sys.argv.index('--source')
        source = sys.argv[idx + 1] if idx + 1 < len(sys.argv) else DEFAULT_SOURCE

    if cmd == 'compress':
        compress(source)
    elif cmd == 'upload':
        upload(source)
    elif cmd == 'sync':
        sync()
    elif cmd == 'all':
        compress(source)
        upload(source)
        sync()
    else:
        print(f'Неизвестная команда: {cmd}')
        print(__doc__)


if __name__ == '__main__':
    main()
