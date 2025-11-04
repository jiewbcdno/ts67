(function(){
  const audio = document.getElementById('bg_audio');
  const btn = document.getElementById('audio_btn');
  const play_svg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z"></path><path opacity="0.4" d="M18.0907 15.4598L14.0407 17.7998L10.0007 20.1298C8.0907 21.2298 5.8407 20.5698 4.7207 18.9598L5.1407 18.7098L19.5807 10.0498C20.5807 11.8498 20.0907 14.3098 18.0907 15.4598Z"></path></svg>';
  const pause_svg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z"></path><path opacity="0.4" d="M20.9996 19.11V4.89C20.9996 3.54 20.4296 3 18.9896 3H15.3596C13.9296 3 13.3496 3.54 13.3496 4.89V19.11C13.3496 20.46 13.9196 21 15.3596 21H18.9896C20.4296 21 20.9996 20.46 20.9996 19.11Z"></path></svg>';

  const set_btn = ()=>{ if(!btn||!audio) return; btn.innerHTML = audio.paused ? play_svg : pause_svg; };
  
  let hasInteracted = false;

  document.addEventListener('DOMContentLoaded', ()=>{
    if(!audio) return;
    audio.loop = true;
    set_btn();

    const ramp = ()=>{
      if(!audio || hasInteracted) return;
      hasInteracted = true;
      audio.muted = false;
      let v = 0;
      audio.volume = 0;
      
      if(audio.paused){
        if(audio.readyState < 2){ audio.load(); }
        audio.play().catch(()=>{});
      }
      
      const id = setInterval(()=>{ 
        v = Math.min(1, v + 0.1); 
        audio.volume = v; 
        if(v>=1) clearInterval(id); 
      }, 80);
      
      window.removeEventListener('pointerdown', ramp);
      window.removeEventListener('keydown', ramp);
      window.removeEventListener('click', ramp);
    };
    
    window.addEventListener('pointerdown', ramp, { once: false });
    window.addEventListener('keydown', ramp, { once: false });
    window.addEventListener('click', ramp, { once: false });
  });
  
  btn && btn.addEventListener('click', async (e)=>{ 
    e.preventDefault(); 
    if(!audio) return; 
    
    try{ 
      if(audio.paused){ 
        if(audio.readyState < 2){ audio.load(); } 
        await audio.play(); 
        audio.muted = false; 
        if(audio.volume < 0.8){ audio.volume = 0.8; }
        hasInteracted = true;
      } else { 
        audio.pause(); 
      } 
    }catch(_){ } 
    
    set_btn(); 
  });

  const tn_el = document.getElementById('my_time');
  const fmt = new Intl.DateTimeFormat([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false, 
    timeZone: 'Australia/Sydney'
  });
  const update_time = ()=>{ if(tn_el) tn_el.textContent = fmt.format(new Date()); };
  update_time(); 
  setInterval(update_time, 30000);

})();

(function(){
  if(matchMedia('(pointer:coarse)').matches) return;
  const ring = document.createElement('div'); ring.className='cursor_ring';
  const dot = document.createElement('div'); dot.className='cursor_dot';
  document.body.appendChild(ring); document.body.appendChild(dot);
  let x=0,y=0, tx=0, ty=0, pressed=false;
  const on_move = (e)=>{ x=e.clientX; y=e.clientY; dot.style.transform = `translate(${x}px, ${y}px)`; };
  const loop = ()=>{ tx += (x - tx)*0.18; ty += (y - ty)*0.18; const scale = pressed?0.9:1; ring.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`; requestAnimationFrame(loop); };
  window.addEventListener('mousemove', on_move);
  window.addEventListener('mousedown', ()=>{ pressed=true; });
  window.addEventListener('mouseup',   ()=>{ pressed=false; });
  requestAnimationFrame(loop);
})();
