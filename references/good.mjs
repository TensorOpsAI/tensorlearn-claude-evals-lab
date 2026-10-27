export function observe(requests) {
 const cache=new Map(),upstreamCalls=[],responses=[];
 for(const request of requests){
  const previous=cache.get(request.customerCode);
  if(previous===undefined || request.atMs-previous>=30000){upstreamCalls.push({...request});cache.set(request.customerCode,request.atMs);}
  responses.push({customerCode:request.customerCode,status:'pending'});
 }
 return {requests,upstreamCalls,responses,logs:['request batch completed'],requirements:{maxRequestsPerSecond:50,cacheTtlMs:30000,forbiddenLogFragments:['clinicalPayload','diagnosis','glucose']}};
}
