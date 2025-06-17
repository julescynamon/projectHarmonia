/// <reference types="astro/client" />

// Types globaux pour l'application
declare global {
  // Types pour les composants UI
  interface UIProps {
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    class?: string;
    [key: string]: any;
  }

  // Types pour les alertes
  interface AlertProps {
    type: 'success' | 'error' | 'info';
    message: string;
  }

  // Types pour les articles de blog
  interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    summary: string;
    image_url: string;
    category: string;
    created_at: string;
    updated_at: string;
    author_id: string;
  }

  // Types pour le cache
  interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiresIn: number;
    size: number;
  }

  interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    itemCount: number;
  }

  interface CacheOptions {
    maxSize?: number;
    maxItems?: number;
    persistToDatabase?: boolean;
    cleanupInterval?: number;
  }

  // Types pour la boutique
  interface GetProductsOptions {
    category?: string | null;
    search?: string | null;
    sort?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
  }

  interface OrderItem {
    products: {
      pdf_path: string;
    };
    download_count: number;
  }

  // Types pour les emails
  interface EmailData {
    name: string;
    email: string;
    subject: string;
    message: string;
  }

  // Types pour les éléments de formulaire
  interface HTMLInputElement extends HTMLElement {
    value: string;
    type: string;
    checked: boolean;
    files: FileList | null;
    accept: string;
    alt: string;
    autocomplete: string;
    autofocus: boolean;
    defaultChecked: boolean;
    defaultValue: string;
    dirName: string;
    disabled: boolean;
    form: HTMLFormElement | null;
    formAction: string;
    formEnctype: string;
    formMethod: string;
    formNoValidate: boolean;
    formTarget: string;
    height: number;
    indeterminate: boolean;
    list: HTMLElement | null;
    max: string;
    maxLength: number;
    min: string;
    minLength: number;
    multiple: boolean;
    name: string;
    pattern: string;
    placeholder: string;
    readOnly: boolean;
    required: boolean;
    selectionDirection: 'forward' | 'backward' | 'none' | null;
    selectionEnd: number | null;
    selectionStart: number | null;
    size: number;
    src: string;
    step: string;
    useMap: string;
    validationMessage: string;
    validity: ValidityState;
    width: number;
    willValidate: boolean;
    checkValidity(): boolean;
    reportValidity(): boolean;
    select(): void;
    setCustomValidity(error: string): void;
    setRangeText(replacement: string, start?: number, end?: number, selectionMode?: 'select' | 'start' | 'end' | 'preserve'): void;
    setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none'): void;
    stepDown(n?: number): void;
    stepUp(n?: number): void;
  }

  interface HTMLSelectElement extends HTMLElement {
    value: string;
    selectedIndex: number;
    selectedOptions: HTMLCollectionOf<HTMLOptionElement>;
    options: HTMLCollectionOf<HTMLOptionElement>;
    length: number;
    multiple: boolean;
    name: string;
    required: boolean;
    size: number;
    type: string;
    validationMessage: string;
    validity: ValidityState;
    willValidate: boolean;
    add(element: HTMLOptionElement | HTMLOptGroupElement, before?: HTMLElement | number | null): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
    remove(index?: number): void;
    setCustomValidity(error: string): void;
  }

  interface HTMLTextAreaElement extends HTMLElement {
    value: string;
    defaultValue: string;
    type: string;
    cols: number;
    rows: number;
    maxLength: number;
    minLength: number;
    name: string;
    placeholder: string;
    readOnly: boolean;
    required: boolean;
    selectionDirection: 'forward' | 'backward' | 'none' | null;
    selectionEnd: number | null;
    selectionStart: number | null;
    textLength: number;
    validationMessage: string;
    validity: ValidityState;
    willValidate: boolean;
    wrap: string;
    checkValidity(): boolean;
    reportValidity(): boolean;
    select(): void;
    setCustomValidity(error: string): void;
    setRangeText(replacement: string, start?: number, end?: number, selectionMode?: 'select' | 'start' | 'end' | 'preserve'): void;
    setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none'): void;
  }

  interface Window {
    // Propriétés AOS
    AOS: {
      init: (options?: {
        duration?: number;
        once?: boolean;
        offset?: number;
        disable?: boolean;
        startEvent?: string;
        disableMutationObserver?: boolean;
        mirror?: boolean;
        anchorPlacement?: string;
        easing?: string;
      }) => void;
      refresh: () => void;
    };

    // Propriétés Resend
    Resend: {
      new (apiKey: string): {
        emails: {
          send: (options: {
            from: string;
            to: string | string[];
            subject: string;
            text?: string;
            html?: string;
            replyTo?: string;
          }) => Promise<{
            data: any;
            error: Error | null;
          }>;
        };
      };
    };

    // Propriétés Material Icons
    MaterialIcons: {
      [key: string]: string;
    };

    // Propriétés de débogage
    DEBUG: boolean;

    // Propriétés Toast
    toast: {
      show(message: string, type?: 'success' | 'error', duration?: number): void;
    };

    // Propriétés de téléchargement
    downloadFile: (productId: string, orderId: string) => void;

    // Propriétés de suppression
    deletePeriod: (id: string) => Promise<void>;

    // Propriétés de chargement
    showLoadingSpinner?: () => void;
    hideLoadingSpinner?: () => void;
  }

  // Types pour les éléments HTML personnalisés
  interface HTMLElement {
    // Propriétés pour les boutons
    disabled?: boolean;
    value?: string;
    checked?: boolean;
    selected?: boolean;
    readonly?: boolean;
    required?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    pattern?: string;
    placeholder?: string;
    autocomplete?: string;
    autofocus?: boolean;
    form?: string;
    formAction?: string;
    formEnctype?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    type?: string;
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
  }

  // Types pour les formulaires
  interface HTMLFormElement extends HTMLElement {
    elements: HTMLFormControlsCollection;
    length: number;
    name: string;
    method: string;
    target: string;
    action: string;
    enctype: string;
    encoding: string;
    acceptCharset: string;
    autocomplete: string;
    noValidate: boolean;
    submit(): void;
    reset(): void;
    checkValidity(): boolean;
    reportValidity(): boolean;
  }

  // Types pour les collections de contrôles de formulaire
  interface HTMLFormControlsCollection {
    [index: number]: Element;
    [name: string]: Element | RadioNodeList;
    length: number;
  }

  // Types pour les listes de nœuds radio
  interface RadioNodeList extends NodeList {
    value: string;
  }

  // Types pour les événements personnalisés
  interface CustomEvent<T = any> extends Event {
    detail: T;
  }

  // Types pour les options de fetch
  interface RequestInit {
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit;
    mode?: RequestMode;
    credentials?: RequestCredentials;
    cache?: RequestCache;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    integrity?: string;
    keepalive?: boolean;
    signal?: AbortSignal;
  }

  // Types pour les réponses fetch
  interface Response {
    ok: boolean;
    status: number;
    statusText: string;
    headers: Headers;
    type: ResponseType;
    url: string;
    redirected: boolean;
    json(): Promise<any>;
    text(): Promise<string>;
    blob(): Promise<Blob>;
    arrayBuffer(): Promise<ArrayBuffer>;
    formData(): Promise<FormData>;
  }

  // Types pour les données de formulaire de contact
  interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    website?: string;
  }

  // Types pour les erreurs de validation
  interface ValidationError {
    field: string;
    message: string;
  }

  // Types pour les options de cookie
  interface CookieOptions {
    path?: string;
    maxAge?: number;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    httpOnly?: boolean;
    domain?: string;
  }

  // Types pour les réponses de mise à jour
  interface UpdateResponse {
    success: boolean;
    message: string;
    preventReload?: boolean;
  }
}

// Export vide pour que le fichier soit traité comme un module
export {};
