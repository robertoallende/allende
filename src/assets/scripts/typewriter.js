// Typewriter Animation Controller

class TypewriterEffect {
  constructor(element, options = {}) {
    this.element = element;
    this.text = element.textContent;
    this.speed = options.speed || 50;
    this.delay = options.delay || 0;
    this.cursor = options.cursor !== false;
    
    // Clear the element and start animation
    this.element.textContent = '';
    this.element.classList.add('typewriter');
    
    if (this.delay > 0) {
      setTimeout(() => this.start(), this.delay);
    } else {
      this.start();
    }
  }
  
  start() {
    let i = 0;
    const type = () => {
      if (i < this.text.length) {
        this.element.textContent += this.text.charAt(i);
        i++;
        setTimeout(type, this.speed);
      } else {
        // Animation complete
        this.element.classList.add('complete');
        this.element.classList.remove('typing');
        if (!this.cursor) {
          this.element.classList.remove('typewriter');
        }
      }
    };
    
    this.element.classList.add('typing');
    type();
  }
}

// Chat-style progressive reveal
class ChatReveal {
  constructor() {
    this.elements = document.querySelectorAll('.chat-reveal');
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.1 }
    );
    
    this.elements.forEach(el => this.observer.observe(el));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize typewriter effects
  document.querySelectorAll('[data-typewriter]').forEach((element, index) => {
    const speed = parseInt(element.dataset.speed) || 50;
    const delay = parseInt(element.dataset.delay) || index * 1000;
    const cursor = element.dataset.cursor !== 'false';
    
    new TypewriterEffect(element, { speed, delay, cursor });
  });
  
  // Initialize chat reveal animations
  new ChatReveal();
});

// Respect user motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('DOMContentLoaded', () => {
    // Skip animations for users who prefer reduced motion
    document.querySelectorAll('[data-typewriter]').forEach(element => {
      element.classList.remove('typewriter');
    });
    
    document.querySelectorAll('.chat-reveal').forEach(element => {
      element.classList.add('visible');
    });
  });
}
