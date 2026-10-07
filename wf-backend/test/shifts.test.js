import {test} from 'node:test';
import assert from 'node:assert/strict';
import {shiftDays,shiftState,upcomingAlerts} from '../../wf/model.js';
const profile={shiftDays:'5,6',shiftStart:'22:45',shiftEnd:'07:15'};
const state=iso=>shiftState(profile,new Date(iso));
test('weekly ticks retain old weekday labels and reject missing or invalid schedules',()=>{
 assert.deepEqual(shiftDays('Friday & Saturday'),[5,6]);assert.deepEqual(shiftDays('الجمعة، السبت'),[5,6]);assert.deepEqual(shiftDays('1,1,5'),[1,5]);
 assert.equal(shiftState({...profile,shiftDays:''}).status,'unset');assert.equal(shiftState({...profile,shiftEnd:'22:45'}).status,'unset');assert.equal(shiftState({...profile,shiftStart:'25:00'}).status,'unset');
});

test('alerts only flag near shifts and unfinished training due soon in London time',()=>{
 const profile={shiftDays:'5,6',shiftStart:'22:45',shiftEnd:'07:15',startDate:'2026-10-07'};
 const courses=[
  {id:'past',due:'2026-10-08',status:'not-started'},
  {id:'soon',due:'2026-10-11',status:'in-progress'},
  {id:'later',due:'2026-10-20',status:'not-started'},
  {id:'done',due:'2026-10-08',status:'completed'}
 ];
 const now=new Date('2026-10-09T20:00:00Z');
 assert.deepEqual(upcomingAlerts(profile,courses,now).map(a=>a.kind==='training'?a.course.id:a.kind),['shift-soon','past','soon']);
 const active=upcomingAlerts(profile,[],new Date('2026-10-09T22:00:00Z'));
 assert.equal(active[0].kind,'shift-active');
 assert.deepEqual(upcomingAlerts({},[{id:'none',due:'',status:'not-started'}],now),[]);
});
test('London overnight shifts activate and end exactly, including the day after the selected start day',()=>{
 assert.equal(state('2026-10-09T21:44:59Z').status,'today');
 const active=state('2026-10-09T21:45:00Z');assert.equal(active.status,'active');assert.equal(active.current.end.toISOString(),'2026-10-10T06:15:00.000Z');assert.equal(active.next.start.toISOString(),'2026-10-10T21:45:00.000Z');
 assert.equal(state('2026-10-10T06:14:59Z').status,'active');assert.equal(state('2026-10-10T06:15:00Z').status,'today');
 assert.equal(state('2026-10-11T05:00:00Z').status,'active');const off=state('2026-10-11T06:15:00Z');assert.equal(off.status,'off');assert.equal(off.next.start.toISOString(),'2026-10-16T21:45:00.000Z');
});
test('UK daylight saving changes adjust actual overnight duration and ignore device timezone',()=>{
 const autumn=shiftState(profile,new Date('2026-10-24T23:00Z'));assert.equal(autumn.current.start.toISOString(),'2026-10-24T21:45:00.000Z');assert.equal(autumn.current.end.toISOString(),'2026-10-25T07:15:00.000Z');
 const spring=shiftState(profile,new Date('2026-03-28T23:00Z'));assert.equal(spring.current.start.toISOString(),'2026-03-28T22:45:00.000Z');assert.equal(spring.current.end.toISOString(),'2026-03-29T06:15:00.000Z');
});
test('daytime shifts and employment start dates determine the next valid start',()=>{
 const day={shiftDays:'1,2,3,4,5',shiftStart:'09:00',shiftEnd:'17:00',startDate:'2026-10-12'};
 const future=shiftState(day,new Date('2026-10-07T12:00Z'));assert.equal(future.status,'off');assert.equal(future.next.start.toISOString(),'2026-10-12T08:00:00.000Z');
 assert.equal(shiftState(day,new Date('2026-10-12T08:00Z')).status,'active');assert.equal(shiftState(day,new Date('2026-10-12T16:00Z')).status,'off');
});
