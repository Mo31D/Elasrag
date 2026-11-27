// Browser-viewport gesture lock for this game page only. Camera controls stay independent.
export function suppressPageZoom(doc:Document=document){
 let last:{time:number;x:number;y:number}|null=null;
 const cancel=(event:Event)=>{if(event.cancelable)event.preventDefault();};
 const touchStart=(event:TouchEvent)=>{if(event.touches.length>1){last=null;cancel(event);}};
 const touchMove=(event:TouchEvent)=>{if(event.touches.length>1)cancel(event);};
 const touchEnd=(event:TouchEvent)=>{
   if(event.touches.length||event.changedTouches.length!==1){last=null;return;}
   const t=event.changedTouches[0],now=event.timeStamp;
   if(last&&now-last.time>=0&&now-last.time<350&&Math.hypot(t.clientX-last.x,t.clientY-last.y)<35)cancel(event);
   last={time:now,x:t.clientX,y:t.clientY};
 };
 const wheel=(event:WheelEvent)=>{if(event.ctrlKey||event.metaKey)cancel(event);};
 const key=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&['+','=','-','0'].includes(event.key))cancel(event);};
 const options={passive:false,capture:true};
 doc.addEventListener('touchstart',touchStart,options);
 doc.addEventListener('touchmove',touchMove,options);
 doc.addEventListener('touchend',touchEnd,options);
 for(const name of ['gesturestart','gesturechange','gestureend','dblclick'])doc.addEventListener(name,cancel,options);
 doc.addEventListener('wheel',wheel,options);doc.addEventListener('keydown',key,options);
}
