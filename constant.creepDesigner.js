module.exports = {
  design: design
}

function design(minimumBody, idealBody, energyBudget) {
  let body = minimumBody;
  let queue = _.difference(minimumBody, idealBody);
  
  while(queue.length > 0) {
    let part = queue.pop();

    if(bodyCost(body) + BODYPART_COST[part] > energyBudget)
      break;
    else
      body.push(part);
  }

  return body;
}

function bodyCost(body) {
  return _.sum(body.map(part => BODYPART_COST[part]));
}