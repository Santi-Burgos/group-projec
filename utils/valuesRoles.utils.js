const ROLES_ENUMS ={
  'Owner': 3,
  'Admin': 2,
  'Member': 1,
}

export const roleCanDo = async(roleActuator, passiveRole) =>{
  const weightActuator = ROLES_ENUMS[roleActuator];
  const weightPassive = ROLES_ENUMS[passiveRole];

  if(weightActuator === undefined || weightPassive === undefined){
    return false
  }

  return weightActuator > weightPassive;
}