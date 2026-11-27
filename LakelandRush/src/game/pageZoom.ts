// Only gameplay gestures are intercepted. Title, settings, map and other menus retain native scroll.
export function suppressPageZoom(doc:Document=document){
 let last:{time:number;x:number;y:number}|null=null;
 const playing=(event:Event)=>doc.body?.dataset.state==='playing'&&!(event.target instanceof Element&&event.target.closest('[role="dialog"],input,textarea,select'));
 const cancel=(event:Event)=>{if(playing(event)&&event.cancelable)event.preventDefault();};
 const touchStart=(event:TouchEvent)=>{if(!playing(event)){last=null;return;}if(event.touches.length>1){last=null;cancel(event);}};
 const touchMove=(event:TouchEvent)=>{if(event.touches.length>1)cancel(event);};
 const touchEnd=(event:TouchEvent)=>{
  if(!playing(event)||event.touches.length||event.changedTouches.length!==1){last=null;return;}
  const t=event.changedTouches[0],now=event.timeStamp;
  if(last&&now-last.time>=0&&now-last.time<350&&Math.hypot(t.clientX-last.x,t.clientY-last.y)<35)cancel(event);
  last={time:now,x:t.clientX,y:t.clientY};
 };
 const options={passive:false,capture:true};
 doc.addEventListener('touchstart',touchStart,options);doc.addEventListener('touchmove',touchMove,options);doc.addEventListener('touchend',touchEnd,options);
 for(const name of ['gesturestart','gesturechange','gestureend','dblclick'])doc.addEventListener(name,cancel,options);
 doc.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey)cancel(e);},options);
 doc.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['+','=','-','0'].includes(e.key))cancel(e);},options);
}
