const fullName = "M:Scripting.Logger.Info(System.String,System.Boolean)";

const parseDocData = (data)=>{
  const rawMembers = data.doc.members.member;
  const members = rawMembers.map(member=>getMemberData(member));
  return members;
}

const getMemberData = member=> ({
  fullName: getFullName(member),
  name: getName(member),
  typeName: getTypeName(member),
  typeCode: getTypeCode(member),
  parent: getParent(member),
  summary: getSummary(member),
  params: getParams(member)

});


const member =         {
  summary: "\n            Log a debug message to the Sympholight log.\n            ",
  param: [
    {
      _name: "text",
      __text: "The message text"
    },
    {
      _name: "notify",
      __text: "If true, an additional notification window will pop up temporarily."
    }
  ],
  _name: "M:Scripting.Logger.Debug(System.String,System.Boolean)"
}


const getTypeName = (member)=>{
  const types={
    M: "Member",
    T: "Type",
    P: "Property"
  }

  return types[getTypeCode(member)];
}

const getTypeCode = (member) =>{
  const name = member._name;
  const re = /^([MTP]):/;
  const typeCode = re.exec(name)[1];
  return typeCode;
}


const getFullName = (member)=>{
  const name = member._name;
  const re = /:([\w.]*)\(?/;
  const val = re.exec(name);
  return val[1];
}

const getName = (member)=>{
  const fullName = getFullName(member);
  const [name] = fullName.split('.').slice(-1);
  return name;
}

const getParent = (member)=>{
  const name = getFullName(member);
  const parent = name.split('.').slice(0,-1).join('.');
  return parent;
}

const getSummary = (member) =>{
  return member.summary.trim();
}


const getParams = (member) =>{
  const paramTypes = getParamTypes(member);
  const normalizedParams = Array.isArray(member.param) ? member.param : [member.param];
  const params = paramTypes && member.param && normalizedParams.map(
      ({_name, __text}, index) => ({name:_name, text: __text, type: paramTypes[index]})
  );
  return params;
}

const getParamTypes = (member) =>{
  const re = /\((.*)\)$/
  const match = re.exec(member._name);

  return match && match[1].split(',');
}



export default parseDocData;
