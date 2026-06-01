export default class I18n {
  constructor(private currentLocale: string, private messages: Record<string, Record<string, string>>) {}

  locale(nextLocale?: string) {
    if (nextLocale) this.currentLocale = nextLocale
    return this.currentLocale
  }

  t(key: string) {
    return this.messages[this.currentLocale]?.[key] ?? this.messages['en-US']?.[key] ?? key
  }
}
