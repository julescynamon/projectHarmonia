import { describe, it, expect } from 'vitest';

// Simulation de la logique du composant Button
const generateButtonClasses = (props: {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
}) => {
  const { variant = 'primary', size = 'md', class: className = '' } = props;

  const variants = {
    primary: 'bg-sage text-white hover:bg-gold hover:text-ebony',
    secondary: 'bg-gold text-ebony hover:bg-sage hover:text-white',
    outline: 'bg-transparent border-2 border-sage text-sage hover:bg-sage hover:text-white'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  const baseClasses = 'inline-block font-slogan rounded-full transition-all duration-300 transform hover:-translate-y-1';
  return `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
};

describe('Button Component', () => {
  it('devrait générer les classes par défaut', () => {
    const classes = generateButtonClasses({});
    
    expect(classes).toContain('inline-block');
    expect(classes).toContain('font-slogan');
    expect(classes).toContain('rounded-full');
    expect(classes).toContain('bg-sage');
    expect(classes).toContain('text-white');
    expect(classes).toContain('px-6 py-3');
  });

  it('devrait appliquer la variante primary', () => {
    const classes = generateButtonClasses({ variant: 'primary' });
    
    expect(classes).toContain('bg-sage');
    expect(classes).toContain('text-white');
    expect(classes).toContain('hover:bg-gold');
    expect(classes).toContain('hover:text-ebony');
  });

  it('devrait appliquer la variante secondary', () => {
    const classes = generateButtonClasses({ variant: 'secondary' });
    
    expect(classes).toContain('bg-gold');
    expect(classes).toContain('text-ebony');
    expect(classes).toContain('hover:bg-sage');
    expect(classes).toContain('hover:text-white');
  });

  it('devrait appliquer la variante outline', () => {
    const classes = generateButtonClasses({ variant: 'outline' });
    
    expect(classes).toContain('bg-transparent');
    expect(classes).toContain('border-2');
    expect(classes).toContain('border-sage');
    expect(classes).toContain('text-sage');
  });

  it('devrait appliquer la taille sm', () => {
    const classes = generateButtonClasses({ size: 'sm' });
    
    expect(classes).toContain('px-4 py-2');
    expect(classes).toContain('text-sm');
  });

  it('devrait appliquer la taille lg', () => {
    const classes = generateButtonClasses({ size: 'lg' });
    
    expect(classes).toContain('px-8 py-4');
    expect(classes).toContain('text-lg');
  });

  it('devrait ajouter des classes personnalisées', () => {
    const customClass = 'custom-button-class';
    const classes = generateButtonClasses({ class: customClass });
    
    expect(classes).toContain(customClass);
  });

  it('devrait combiner variante, taille et classes personnalisées', () => {
    const classes = generateButtonClasses({
      variant: 'secondary',
      size: 'lg',
      class: 'custom-class'
    });
    
    expect(classes).toContain('bg-gold');
    expect(classes).toContain('text-ebony');
    expect(classes).toContain('px-8 py-4');
    expect(classes).toContain('text-lg');
    expect(classes).toContain('custom-class');
  });
}); 