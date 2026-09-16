(function(){
  var canvas = document.getElementById('starfield');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = [];
    for(var i = 0; i < Math.floor(innerWidth * innerHeight / 8000); i++){
      stars.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.6 + 0.3,
        speed: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        warm: Math.random() < 0.15
      });
    }
  }

  window.addEventListener('resize', resize);
  resize();

  var time = 0;
  function draw(){
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    stars.forEach(function(star){
      var alpha = reducedMotion ? star.a : star.a * (0.6 + 0.4 * Math.sin(time * star.speed + star.phase));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = star.warm ? 'rgba(255,184,77,' + alpha + ')' : 'rgba(200,225,255,' + alpha + ')';
      ctx.fill();
    });
    time += 0.02;
    if(!reducedMotion) requestAnimationFrame(draw);
  }
  draw();
})();
