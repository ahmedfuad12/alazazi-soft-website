(function(){var d=document,h=d.documentElement;h.classList.add('js');
d.addEventListener('click',function(e){var a=e.target.closest('[data-lang]');if(a){try{localStorage.setItem('lang',a.getAttribute('data-lang'))}catch(_){}}});
d.addEventListener('DOMContentLoaded',function(){var b=d.querySelector('.menu'),n=d.querySelector('nav');
if(b&&n)b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o)});
var els=d.querySelectorAll('.rv');
if(!('IntersectionObserver' in window)){els.forEach(function(x){x.classList.add('in')});return}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});
els.forEach(function(x){io.observe(x)})})})();
