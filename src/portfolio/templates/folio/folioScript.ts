export function generateFolioJs(): string {
  return `
(function(){
  // Scroll reveal
  var els=document.querySelectorAll("[data-reveal]");
  if("IntersectionObserver"in window){
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add("revealed");obs.unobserve(e.target)}
      });
    },{threshold:0.12,rootMargin:"0px 0px -40px 0px"});
    els.forEach(function(el){obs.observe(el)});
  }else{
    els.forEach(function(el){el.classList.add("revealed")});
  }

  // Active nav highlight on scroll
  var sections=document.querySelectorAll(".portfolio-section[id]");
  var navLinks=document.querySelectorAll(".site-nav a[href^=\\"#\\"]");
  if(sections.length&&navLinks.length){
    var navObs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          navLinks.forEach(function(l){l.classList.remove("active")});
          var match=document.querySelector('.site-nav a[href="#'+e.target.id+'"]');
          if(match)match.classList.add("active");
        }
      });
    },{threshold:0.3,rootMargin:"-80px 0px -50% 0px"});
    sections.forEach(function(s){navObs.observe(s)});
  }
})();
`.trim()
}
