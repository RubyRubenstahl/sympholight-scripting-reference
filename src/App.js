import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Members from './Members'
import axios from 'axios';
import parseDocData from './parseDocData';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, Checkbox, Paper} from 'material-ui';
import {Sticky, StickyContainer} from 'react-sticky';
import typeColorCodes from './typeColorCodes'
injectTapEventPlugin();

const hasTextFilter = (member, text) =>{
  const testText = member.fullName.toLowerCase();
  return(testText.includes(text.toLowerCase()))
}


const headerStyle ={
  fontSize: 31,
  marginTop: 25,
  marginBottom: 20,
  color: '#FFF',
  padding: 1,
  textShadow: 'rgb(2, 4, 4) 4px 2px 10px'
}
const header=(
    <div style={headerStyle}>
      SYMPHOLIGHT Scripting Reference
    </div>
)

const typeFilter = (member, filters) => {

  if(!filters.type && !filters.method && !filters.property){
    return true;
  }
  if(filters.type && member.typeCode=='T') return true;
  if(filters.method && member.typeCode=='M') return true;
  if(filters.property && member.typeCode=='P') return true;
}

const filterMembers = (members, filters) => {

    return members.filter(member=>{
        return hasTextFilter(member, filters.name)
               && typeFilter(member, filters);

    })

};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        name: '',
        method: true,
        property: false,
        type: true
      },
      members: [],
      filteredMembers: []
    }
  }

  componentDidMount() {
    axios.get('./ScriptingDoc.json').then(res => {
      let members = parseDocData(res.data);
      this.setState({members});
    })
  }


  handleSearchChange(e) {
    // console.log(e.target.value);
    let filters = this.state.filters;
    filters.name = e.target.value;
    this.setState({filters});
  }

  handleTypeFilterChange(type, e ) {
    // console.log(type);
    let filters = this.state.filters;
    filters[type] = e.target.checked;
    this.setState({filters});
  }




  render() {
    const {members, filters} = this.state;
    let filteredMembers = filterMembers(members, filters).slice(0,25);



    return (
        <MuiThemeProvider>
          <StickyContainer>
            <div className="wrap">
              {header}
                <Paper className="filters" zDepth={3}>
                  <SearchBar searchText={this.state.filters.name}
                             onChange={this.handleSearchChange.bind(this)}/><br/>
                  <div style={{display: 'flex', flexDirection: 'row', paddingLeft:15,paddingBottom:10}}>
                    <FilterCheckBox label="Methods" checked={filters.method}
                              onCheck={this.handleTypeFilterChange.bind(this, 'method')}
                              color={typeColorCodes['M']}
                    />
                    <FilterCheckBox label="Types" checked={filters.type}
                              onCheck={this.handleTypeFilterChange.bind(this, 'type')}
                              color={typeColorCodes['T']}

                    />
                    <FilterCheckBox label="Properties" checked={filters.property}
                              onCheck={this.handleTypeFilterChange.bind(this, 'property')}
                              color={typeColorCodes['P']}

                    />
                  </div>
                </Paper>
              <Members members={members} filteredMembers={filteredMembers}/>
            </div>
          </StickyContainer>
        </MuiThemeProvider>

    );
  }
}

const FilterCheckBox = ({label, checked, onCheck, color= "#555"}) =>{
  return (
      <Checkbox label={label} checked={checked}
                iconStyle={{marginRight:6, fill:color}}

                onCheck={onCheck}
                style={{width:'auto', paddingRight:40}}/>
  )};



        const nameFilter = (members, filterValues={name:''})=>{
        let filter = filterValues.name.trim().toLowerCase();
        //console.log(filter);
        if(filter==='') return members;
        return members.filter((member)=>
        member.fullName.toString().trim().toLowerCase()
        .includes(filter));
      }

        const checkBoxFilter = (members, filterValues={}) => {
        return members.filter((member)=>{
        //console.log(member.type, filterValues[member.type]==true);
        return filterValues[member.type];
      });
      }


        const SearchBar =  ({searchText, onChange}) => {
        return(<input type="input" className="search-bar" onChange={onChange} value={searchText} placeholder="Search..."/>);
      }

        // const Checkbox = ({value, onChange, title=""})=>{
//   return(<span><input type="checkbox" onChange={onChange} checked={value} default={true}/>{title}</span>)
// }





        export default App;

