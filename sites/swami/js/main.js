(function(){
  'use strict';
  var root=document.documentElement,btn=document.getElementById('themeBtn');
  var icon=document.getElementById('themeIcon'),label=document.getElementById('themeLabel');
  function current(){
    var a=root.getAttribute('data-theme');
    if(a==='light'||a==='dark')return a;
    return window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  }
  function sync(){
    var t=current();
    btn.setAttribute('aria-pressed',String(t==='light'));
    btn.setAttribute('aria-label','Switch to '+(t==='light'?'dark':'light')+' theme');
    label.textContent=t==='light'?'Dark':'Light';
    icon.textContent=t==='light'?'☾':'☀';
  }
  btn.addEventListener('click',function(){
    var n=current()==='light'?'dark':'light';
    root.setAttribute('data-theme',n);
    try{localStorage.setItem('swami-theme',n);}catch(e){}
    sync();
  });
  sync();


  var track=document.getElementById('track'),car=document.getElementById('carousel');
  var slides=track.children,N=slides.length,cur=0;
  var prev=document.getElementById('prev'),next=document.getElementById('next');
  var dots=document.querySelectorAll('.dot-btn'),count=document.getElementById('count');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(i){
    cur=Math.max(0,Math.min(N-1,i));
    track.scrollTo({left:slides[cur].offsetLeft-track.offsetLeft,behavior:reduce?'auto':'smooth'});
    mark();
  }
  function mark(){
    prev.disabled=cur===0;next.disabled=cur===N-1;
    count.textContent='Slide '+(cur+1)+' of '+N;
    for(var d=0;d<dots.length;d++){dots[d].setAttribute('aria-current',String(d===cur));}
  }
  prev.addEventListener('click',function(){show(cur-1);});
  next.addEventListener('click',function(){show(cur+1);});
  for(var d=0;d<dots.length;d++){(function(k){dots[k].addEventListener('click',function(){show(k);});})(d);}
  car.addEventListener('keydown',function(e){
    if(e.target.closest&&e.target.closest('input,textarea'))return;
    if(e.key==='ArrowRight'){e.preventDefault();show(cur+1);}
    else if(e.key==='ArrowLeft'){e.preventDefault();show(cur-1);}
    else if(e.key==='Home'){e.preventDefault();show(0);}
    else if(e.key==='End'){e.preventDefault();show(N-1);}
  });
  var t;
  track.addEventListener('scroll',function(){
    clearTimeout(t);
    t=setTimeout(function(){
      var i=Math.round(track.scrollLeft/track.clientWidth);
      if(i!==cur){cur=Math.max(0,Math.min(N-1,i));mark();}
    },80);
  },{passive:true});
  mark();

  var form=document.getElementById('enq');
  var rules={name:function(v){return v.trim().length>0;},
    email:function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());},
    message:function(v){return v.trim().length>0;}};
  var errIds={name:'e-name',email:'e-email',message:'e-msg'};
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    var ok=true,first=null,data={};
    Object.keys(rules).forEach(function(k){
      var el=form.elements[k],good=rules[k](el.value);
      el.setAttribute('aria-invalid',String(!good));
      document.getElementById(errIds[k]).hidden=good;
      data[k]=el.value;
      if(!good){ok=false;if(!first)first=el;}
    });
    var msg=document.getElementById('ok');
    if(!ok){msg.hidden=true;first.focus();return;}
    console.log('swami.si concept enquiry (demo only, not sent):',data);
    form.reset();
    msg.hidden=false;msg.focus();
  });
})();
