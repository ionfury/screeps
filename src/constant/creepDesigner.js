module.exports = {
  design: design
}

function design(minimumBodyDefinition, idealBodyDefinition, energyBudget, options) {
  let possibleParts = BODYPARTS_ALL;
  let minimumBody = [];
  let queue = [];
    
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
  console.log(queue)
  
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

function bodyCost(body) {
  return _.sum(body.map(part => BODYPART_COST[part]));
}