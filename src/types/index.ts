// Тип приложения из каталога решений
export interface App {
  id: string; // slug для роута /demo/[app-id]
  demoUnavailable?: boolean;
  name: string;
  tagline: string; // короткое описание (2-3 предложения)
  category: string;
  duration: string; // срок реализации
  hours: string; // трудозатраты
  price: string; // ориентировочная цена
  priceNote: string; // примечание по стоимости
  features: string[]; // ключевые фичи для превью
}

// Тип данных формы заявки
export interface LeadFormData {
  name: string;
  phone: string;
  email?: string;
  interest: string; // какое приложение/задача интересует
}
