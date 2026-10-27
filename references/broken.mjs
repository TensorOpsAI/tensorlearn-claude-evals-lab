export function observe(requests) {
 return {requests,upstreamCalls:requests.map(x=>({...x})),responses:requests.map(x=>({customerCode:x.customerCode,status:'pending'})),logs:['request batch completed'],requirements:{maxRequestsPerSecond:50,cacheTtlMs:30000,forbiddenLogFragments:['clinicalPayload','diagnosis','glucose']}};
}
