/**
 * Created by Mike on 3/22/2017.
 */
import React from 'react';
import {Card, CardText, Paper} from 'material-ui';
import {Avatar, Divider} from 'material-ui';
import {Table, TableRow, TableRowColumn, TableBody, TableHeader, TableHeaderColumn as TableHeaderColumnUnstyled} from 'material-ui';
import commaSeparated from 'comma-separated-tokens';
import typeColorCodes from './typeColorCodes';


const Members = ({members, filteredMembers}) =>{
  return (
      <div className="members">
        {filteredMembers.slice(0,50).map(member=> {
          const properties = members.filter((m)=> member.fullName===m.parent && m.typeCode=="P");
          const methods = members.filter((m)=> member.fullName===m.parent && m.typeCode=="M");
          return Member(member, properties, methods);
         })}
      </div>
  );
};



const Member = (member, properties= [], methods=[]) => {
  const hasParams = member.params && member.params.length>0;
  const hasProperties = properties.length>0;
  const hasMethods = methods.length>0;
  const hasExttendedData = hasParams || hasMethods || hasProperties;
  return (
      <Paper zDepth={3}>
        <Card  id={member.fullName}
               style={{marginBottom:25}}
               key={member.fullName}

               >
          <Header member={member} />

          <CardText expandable={false}>
            {Summary(member)}
            {hasExttendedData && <div><br/><Divider/><br/></div>}
            {hasParams  && <ParamList params={member.params}/> }  <br/>
            {hasMethods  && <MethodList methods={methods}/>}    <br/>
            {hasProperties  && <PropList properties={properties}/>}  <br/>
          </CardText>
        </Card>
      </Paper>
  )
};

const Summary = (member)=>(
  <div style={{paddingLeft:21, fontSize:'1.3em', maxWidth:600,fontWeight:300}}>{member.summary}</div>
)

const TableTitle = ({title})=>(
    <span style={{fontSize:'1.4em', fontWeight: 300, paddingLeft: 21}}>{title}</span>
);

const TableHeaderColumn = ({style, children}) =>{
   const newStyle = Object.assign({}, style, {height:75});
  return(<TableHeaderColumnUnstyled style={newStyle}>{children}</TableHeaderColumnUnstyled>);

}


const renderParamList = (member)=>{
  if(!member.params) return('()');
  const params = member.params
      .map(param=>`${param.type.split('.').slice(-1)} ${param.name}`);
  const paramList = commaSeparated.stringify(params);
  return<span>({paramList})</span>
};


const Header = ({member})=> {

  const bgColors = {
    T: '#f3efff',
    M: '#fff6e7',
    P: '#e1f3ff'

  }

  const headerStyle={
    padding: 20,
    backgroundColor: bgColors[member.typeCode]
  };

  const title = (
      <span style={{fontSize:'1.2em'}}>
          <span style={{paddingLeft:10}}>
            {member.parent}.
          </span>
          <span style={{color:typeColorCodes[member.typeCode]}}>
            {member.name}
            {member.typeCode==='M' && renderParamList(member)}
          </span>
      </span>
  );

  return(
      <div style={headerStyle}>
        <MemberTypeAvatar member={member}/>
        {title}

      </div>
  );
};

const ParamList = ({params=[]}) => {
  return(
     <div>
        <TableTitle title="Parameters"/>
        <Table>
          <TableHeader displaySelectAll={false} style={{height:25}}>
            <TableHeaderColumn style={{width:150}}>Type</TableHeaderColumn>
            <TableHeaderColumn style={{width:100}}>Parameter Name</TableHeaderColumn>
            <TableHeaderColumn>Description</TableHeaderColumn>
          </TableHeader>
         <TableBody displayRowCheckbox={false}>
           {params.map(param=><ParamInfo param={param}/>)}
         </TableBody>
        </Table>
     </div>
    )
};


const ParamInfo = ({param}) => {
  return(
      <TableRow> key={param.fullName}/>
        <TableRowColumn style={{width:150}}>{param.type}</TableRowColumn>
        <TableRowColumn style={{width:100}}>{param.name}</TableRowColumn>
        <TableRowColumn style={{whiteSpace: 'normal', wordWrap: 'break-word'}}>
          {param.text}
          </TableRowColumn>
      </TableRow>

  );
};

const PropList = ({properties=[]}) => (
    <div>
      <TableTitle title="Properties"/>
      <Table>
        <TableHeader displaySelectAll={false}>
          <TableHeaderColumn style={{width:150}}>Name</TableHeaderColumn>
          <TableHeaderColumn>Description</TableHeaderColumn>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {properties.map(property=><PropInfo property={property}/>)}
        </TableBody>
      </Table>
    </div>
);

const PropInfo = ({property}) => {
  return (
      <TableRow> key={property.name}/>
        <TableRowColumn style={{width:150, color:typeColorCodes['P']}}>{property.name}</TableRowColumn>
        <TableRowColumn style={{whiteSpace: 'normal', wordWrap: 'break-word'}}>
          {property.summary}
        </TableRowColumn>
      </TableRow>
  );
};

const MethodList = ({methods=[]}) => (
    <div>
      <TableTitle title="Methods"/>
      <Table>
      <TableHeader displaySelectAll={false}>
        <TableHeaderColumn style={{width:200}}>Name</TableHeaderColumn>
        <TableHeaderColumn>Description</TableHeaderColumn>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {methods.map(method=><MethodInfo method={method}/>)}
      </TableBody>
      </Table>
    </div>
);


const MethodInfo = ({method}) => {
  return (
      <TableRow> key={method.name}/>
        <TableRowColumn style={{width:200, color:typeColorCodes['M']}}>
          {method.name}
          {renderParamList(method)}
        </TableRowColumn>
        <TableRowColumn style={{whiteSpace: 'normal', wordWrap: 'break-word'}}>
          {method.summary}
        </TableRowColumn>
      </TableRow>
  );
};




const MemberTypeAvatar = ({member, size=25})=>(
  <Avatar backgroundColor={typeColorCodes[member.typeCode]}
       color={'#FFF'}
       size={size}>{member.typeCode}
   </Avatar>
);

export default Members;


