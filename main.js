const words = [
  "You",
  "Designer",
  "Student",
  "Publisher",
  "Editor",
  "Book Lover",
  "Writer",
  "Someone"
  ];
  
  const stage = document.getElementById("stage");
  
  words.forEach((word,i)=>{
  const el = document.createElement("div");
  el.className = "word " + (i%2===0?"left":"right");
  el.innerText = word;
  stage.appendChild(el);
  });
  
  const wordEls = document.querySelectorAll(".word");
  
  window.addEventListener("scroll",()=>{
  
  const scrollY = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const progress = scrollY/total;
  
  const segment = 1/words.length;
  
  wordEls.forEach((el,i)=>{
  
  const start = segment*i;
  const end = start + segment;
  
  const local = (progress-start)/(segment);
  
  if(local>0 && local<1){
  
  let y;
  let opacity;
  
  if(local<0.3){
  y = 100 - (local/0.3)*100;
  opacity = local/0.3;
  }
  else if(local<0.7){
  y = 0;
  opacity = 1;
  }
  else{
  y = -((local-0.7)/0.3)*100;
  opacity = 1 - (local-0.7)/0.3;
  }
  
  el.style.opacity = opacity;
  el.style.transform = `translate(-50%, ${y}px)`;
  
  }else{
  
  el.style.opacity=0;
  
  }
  
  });
  
  });