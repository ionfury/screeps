module.exports = {
  design: design
}

function design2(minimum, ideal, budget, options) {
  let possibleParts = [TOUGH,WORK,CARRY,CLAIM,MOVE,ATTACK,RANGED_ATTACK,HEAL];
  let minimumBody = [];
  let queue = [];
  let body = [];

  possibleParts.forEach(part => {
      
    for(let i = 0; i < minimumBodyDefinition[part]; i++) {
      minimumBody.push(part);
    }
    
    for(let i = 0; i < idealBodyDefinition[part] - minimumBodyDefinition[part]; i++) {
      queue.push(part);
    }
  });
  
  if(bodyCost(minimumBody) > budget) return false;




  
  return bodySort(body);
}


function design(minimumBodyDefinition, idealBodyDefinition, energyBudget, options) {
  let possibleParts = [TOUGH,WORK,CARRY,CLAIM,MOVE,ATTACK,RANGED_ATTACK,HEAL];
  let minimumBody = [];
  let queue = [];
  
  // add tough parts firs

  possibleParts.forEach(part => {
      
    for(let i = 0; i < minimumBodyDefinition[part]; i++) {
      minimumBody.push(part);
    }
    
    for(let i = 0; i < idealBodyDefinition[part] - minimumBodyDefinition[part]; i++) {
      queue.push(part);
    }
  });
  
  if(energyBudget < bodyCost(minimumBody))
    return false;
    
  let body = minimumBody;
  
  while(queue.length > 0) {
    let part = queue.shift();

    if(bodyCost(body) + BODYPART_COST[part] > energyBudget) {
      break;
    }
    else {
      body.push(part);
    }
  }

  return body;
}

function bodySort(body) {

}

function bodyCost(body) {
  return _.sum(body.map(part => BODYPART_COST[part]));
}