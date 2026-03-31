export type GalleryCategory = 'all' | 'podcast' | 'interview' | 'portrait' | 'studio' | 'lessons'

export interface GalleryPhoto {
  id: string
  src: string
  category: Exclude<GalleryCategory, 'all'>
  tags: string[]
  orientation: 'landscape' | 'portrait'
}

const S3 = 'https://modulecast-hot.s3.twcstorage.ru/gallery'

export const photos: GalleryPhoto[] = [
  // --- Портреты, тёмный фон, студийный свет ---
  { id: 'DSC00003', src: `${S3}/DSC00003.webp`, category: 'portrait', orientation: 'landscape',
    tags: ['портрет', 'тёмный фон', 'шторы', 'студийный свет', 'backlight', 'контровой свет', 'гость'] },
  { id: 'DSC00012', src: `${S3}/DSC00012.webp`, category: 'portrait', orientation: 'landscape',
    tags: ['портрет', 'тёмный фон', 'шторы', 'студийный свет', 'backlight', 'гость', 'поясной план'] },
  { id: 'DSC00018', src: `${S3}/DSC00018.webp`, category: 'portrait', orientation: 'landscape',
    tags: ['портрет', 'тёмный фон', 'шторы', 'студийный свет', 'backlight', 'растение', 'гость', 'широкий план'] },
  { id: 'DSC00020', src: `${S3}/DSC00020.webp`, category: 'portrait', orientation: 'landscape',
    tags: ['портрет', 'тёмный фон', 'шторы', 'студийный свет', 'backlight', 'растение', 'гость'] },

  // --- Крупный план, кирпичная стена, лофт ---
  { id: 'DSC00074', src: `${S3}/DSC00074.webp`, category: 'portrait', orientation: 'landscape',
    tags: ['портрет', 'крупный план', 'тёмный фон', 'шторы', 'тёплый свет', 'гость'] },
  { id: 'DSC00084', src: `${S3}/DSC00084.webp`, category: 'interview', orientation: 'landscape',
    tags: ['интервью', 'кресло', 'микрофон', 'журавль', 'растение', 'кирпичная стена', 'лофт', 'гость'] },
  { id: 'DSC00104', src: `${S3}/DSC00104.webp`, category: 'interview', orientation: 'landscape',
    tags: ['интервью', 'кресло', 'микрофон', 'журавль', 'растение', 'кирпичная стена', 'лофт', 'крупный план', 'гость'] },

  // --- Интервью: два человека ---
  { id: 'DSC00115', src: `${S3}/DSC00115.webp`, category: 'interview', orientation: 'landscape',
    tags: ['интервью', 'два гостя', 'стулья', 'микрофоны', 'шторы', 'растение', 'широкий план', 'звукоизоляция'] },

  // --- Гость за микрофоном ---
  { id: 'DSC00121', src: `${S3}/DSC00121.webp`, category: 'interview', orientation: 'landscape',
    tags: ['интервью', 'микрофон', 'крупный план', 'шторы', 'звукоизоляция', 'гость'] },

  // --- Студия без людей ---
  { id: 'DSC00147', src: `${S3}/DSC00147.webp`, category: 'studio', orientation: 'landscape',
    tags: ['студия', 'стол', 'микрофоны', 'Kino Flo', 'свет', 'шторы', 'растение', 'стулья', 'пустая студия', 'подкаст стол'] },
  { id: 'DSC00150', src: `${S3}/DSC00150.webp`, category: 'studio', orientation: 'landscape',
    tags: ['студия', 'стол', 'микрофоны', 'шторы', 'растение', 'стулья', 'пустая студия', 'деревянный стол'] },

  // --- Оборудование на столе ---
  { id: 'DSC00167', src: `${S3}/DSC00167.webp`, category: 'studio', orientation: 'landscape',
    tags: ['оборудование', 'стол', 'камеры', 'микрофоны', 'микшер', 'свет', 'журавль', 'шторы', 'растение'] },

  // --- Подкаст запись за столом ---
  { id: 'DSC04167', src: `${S3}/DSC04167.webp`, category: 'podcast', orientation: 'portrait',
    tags: ['подкаст', 'запись', 'стол', 'микрофоны', 'Kino Flo', 'три человека', 'шторы', 'камера'] },
  { id: 'DSC04180', src: `${S3}/DSC04180.webp`, category: 'podcast', orientation: 'portrait',
    tags: ['подкаст', 'запись', 'крупный план', 'пара', 'микрофоны', 'Kino Flo', 'шторы'] },

  // --- Гостья за столом с ноутбуком, чай ---
  { id: 'DSC09608', src: `${S3}/DSC09608.webp`, category: 'podcast', orientation: 'landscape',
    tags: ['подкаст', 'ноутбук', 'микрофон', 'журавль', 'чай', 'растение', 'шторы', 'гость', 'стол'] },
  { id: 'DSC09611', src: `${S3}/DSC09611.webp`, category: 'podcast', orientation: 'landscape',
    tags: ['подкаст', 'ноутбук', 'микрофон', 'журавль', 'чай', 'растение', 'шторы', 'гость'] },
  { id: 'DSC09634', src: `${S3}/DSC09634.webp`, category: 'portrait', orientation: 'portrait',
    tags: ['портрет', 'микрофон', 'ноутбук', 'растение', 'шторы', 'крупный план', 'гость', 'улыбка'] },

  // --- Стоя у микрофона с Kino Flo ---
  { id: 'DSC09644', src: `${S3}/DSC09644.webp`, category: 'portrait', orientation: 'portrait',
    tags: ['портрет', 'стоя', 'микрофон', 'Kino Flo', 'свет', 'растение', 'шторы', 'жесты', 'гость'] },
  { id: 'DSC09647', src: `${S3}/DSC09647.webp`, category: 'portrait', orientation: 'portrait',
    tags: ['портрет', 'стоя', 'микрофон', 'Kino Flo', 'свет', 'растение', 'шторы', 'гость'] },

  // --- Ведущий за столом с MacBook ---
  { id: 'DSC09662', src: `${S3}/DSC09662.webp`, category: 'podcast', orientation: 'landscape',
    tags: ['подкаст', 'ведущий', 'MacBook', 'микрофон', 'журавль', 'чай', 'полки', 'растения', 'шторы', 'стол'] },
  { id: 'DSC09683', src: `${S3}/DSC09683.webp`, category: 'podcast', orientation: 'landscape',
    tags: ['подкаст', 'ведущий', 'MacBook', 'микрофон', 'стол', 'полки', 'шторы'] },

  // --- Интервью: гостья + ведущий в креслах ---
  { id: 'DSC09686', src: `${S3}/DSC09686.webp`, category: 'interview', orientation: 'landscape',
    tags: ['интервью', 'кресло', 'микрофон', 'журавль', 'растение', 'кирпичная стена', 'лофт', 'гость', 'улыбка'] },
  { id: 'DSC09707', src: `${S3}/DSC09707.webp`, category: 'interview', orientation: 'landscape',
    tags: ['интервью', 'кресло', 'микрофон', 'ведущий', 'шторы', 'звукоизоляция'] },
  { id: 'DSC09721', src: `${S3}/DSC09721.webp`, category: 'interview', orientation: 'landscape',
    tags: ['интервью', 'кресло', 'микрофон', 'гость', 'растение', 'шторы'] },
  { id: 'DSC09726', src: `${S3}/DSC09726.webp`, category: 'interview', orientation: 'landscape',
    tags: ['интервью', 'кресло', 'микрофон', 'гость', 'улыбка', 'растение', 'шторы'] },

  // --- Принадлежности для гостей ---
  { id: 'DSC09750', src: `${S3}/DSC09750.webp`, category: 'studio', orientation: 'landscape',
    tags: ['студия', 'удобства', 'вода', 'салфетки', 'чай', 'растения', 'стол', 'забота о гостях'] },

  // --- Гостья с ноутбуком и микрофоном ---
  { id: 'DSC09760', src: `${S3}/DSC09760.webp`, category: 'podcast', orientation: 'landscape',
    tags: ['подкаст', 'ноутбук', 'микрофон', 'журавль', 'растение', 'шторы', 'гость', 'улыбка'] },
  { id: 'DSC09797', src: `${S3}/DSC09797.webp`, category: 'podcast', orientation: 'landscape',
    tags: ['подкаст', 'ноутбук', 'микрофон', 'растение', 'шторы', 'гость', 'улыбка', 'крупный план'] },
  { id: 'DSC09801', src: `${S3}/DSC09801.webp`, category: 'portrait', orientation: 'landscape',
    tags: ['портрет', 'крупный план', 'шторы', 'гость'] },
  { id: 'DSC09810', src: `${S3}/DSC09810.webp`, category: 'podcast', orientation: 'landscape',
    tags: ['подкаст', 'ноутбук', 'микрофон', 'растение', 'шторы', 'гость', 'тёмный фон'] },
  { id: 'DSC09833', src: `${S3}/DSC09833.webp`, category: 'portrait', orientation: 'landscape',
    tags: ['портрет', 'микрофон', 'растение', 'шторы', 'гость', 'улыбка'] },
  { id: 'DSC09839', src: `${S3}/DSC09839.webp`, category: 'portrait', orientation: 'landscape',
    tags: ['портрет', 'микрофон', 'растение', 'шторы', 'гость', 'улыбка', 'поясной план'] },
  { id: 'DSC09862', src: `${S3}/DSC09862.webp`, category: 'portrait', orientation: 'landscape',
    tags: ['портрет', 'микрофон', 'растение', 'шторы', 'гость', 'улыбка', 'свет'] },

  // --- Белый фон, крупный план ---
  { id: 'DSC09949', src: `${S3}/DSC09949.webp`, category: 'lessons', orientation: 'portrait',
    tags: ['уроки', 'белый фон', 'микрофон', 'крупный план', 'портрет', 'гость'] },

  // --- Студия: белый фон, установка ---
  { id: 'DSC09953', src: `${S3}/DSC09953.webp`, category: 'studio', orientation: 'landscape',
    tags: ['студия', 'белый фон', 'микрофон', 'свет', 'стол', 'камера', 'пустая студия', 'расстановка'] },
  { id: 'DSC09961', src: `${S3}/DSC09961.webp`, category: 'studio', orientation: 'landscape',
    tags: ['студия', 'белый фон', 'микрофон', 'Kino Flo', 'свет', 'стол', 'растение', 'шторы', 'пустая студия', 'расстановка', 'звукоизоляция'] },
]
