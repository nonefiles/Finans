export const translations = {
  tr: {
    // Navigation & General
    appTitle: "Mali İşlem Yöneticisi",
    appDescription: "Gelir ve giderlerinizi kolayca takip edin",
    loading: "Yükleniyor...",
    error: "Hata",
    success: "Başarılı",
    cancel: "İptal",
    save: "Kaydet",
    delete: "Sil",
    edit: "Düzenle",

    // Authentication
    signIn: "Giriş Yap",
    signUp: "Kayıt Ol",
    signOut: "Çıkış Yap",
    email: "E-posta",
    password: "Şifre",
    confirmPassword: "Şifreyi Onayla",
    fullName: "Ad Soyad",
    alreadyHaveAccount: "Zaten hesabınız var mı?",
    dontHaveAccount: "Hesabınız yok mu?",
    signInHere: "Buradan giriş yapın",
    signUpHere: "Buradan kayıt olun",

    // Transactions
    addTransaction: "İşlem Ekle",
    editTransaction: "İşlemi Düzenle",
    transactionType: "İşlem Türü",
    amount: "Tutar",
    description: "Açıklama",
    income: "Gelir",
    expense: "Gider",
    recentTransactions: "Son İşlemler",
    noTransactions: "Henüz işlem yok. İlk işleminizi ekleyerek başlayın.",
    transactionAdded: "İşlem başarıyla eklendi",
    transactionUpdated: "İşlem başarıyla güncellendi",
    transactionDeleted: "İşlem başarıyla silindi",
    transactionCount: "işlem kaydedildi",

    // Summary
    totalIncome: "Toplam Gelir",
    totalExpenses: "Toplam Gider",
    netBalance: "Net Bakiye",

    // Form placeholders
    enterAmount: "Tutarı girin (örn: 100.50)",
    enterDescription: "İşlem açıklamasını girin",
    selectType: "Tür seçin",

    // Validation messages
    fieldRequired: "Bu alan zorunludur",
    invalidEmail: "Geçerli bir e-posta adresi girin",
    passwordTooShort: "Şifre en az 6 karakter olmalıdır",
    passwordsNotMatch: "Şifreler eşleşmiyor",
    invalidAmount: "Geçerli bir tutar girin (0'dan büyük olmalıdır)",
    amountTooLarge: "Tutar çok büyük (maksimum 999,999,999.99)",

    // Date formatting
    today: "Bugün",
    yesterday: "Dün",

    // Currency
    currency: "₺",

    // Actions
    confirmDelete: "Bu işlemi silmek istediğinizden emin misiniz?",
    deleteConfirmation: "Bu işlem geri alınamaz.",

    // Status messages
    syncInfo: "Veriler tüm cihazlarda senkronize edilir",
    autoRefresh: "Sayfa otomatik olarak güncelleniyor",
    connectionError: "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.",
    dataLoadError: "Veriler yüklenirken hata oluştu",

    // Empty states
    noDataAvailable: "Henüz veri bulunmuyor",
    startAddingTransactions: "İşlem eklemeye başlayın",
  },
}

export type TranslationKey = keyof typeof translations.tr
export const t = (key: TranslationKey): string => translations.tr[key]
