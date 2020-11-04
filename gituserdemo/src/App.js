import React from 'react';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css";  
import axios from 'axios';


export default class App extends React.Component {
  state = {
    name: '',
    users: [],
    followers: [],
    following : [],
    oneRepoForUser : '',
    reposDetails : ' '
  }

  handleChange = event => {
       this.setState({ name: event.target.value });
  }



   handleSubmit = event => {
    event.preventDefault();
    
    if(this.state.name === ''){
      let errorMsg="Please provide the User Name"
      this.setState({ errorMsg });

    }else
    {
      
      this.setState({ errorMsg : '' });
    }


    axios.get(`https://api.github.com/users/${this.state.name}`)
      .then(res => {
        const users = res.data;
        this.setState({ users });
      })

      
      axios.get(`https://api.github.com/users/${this.state.name}/followers`)
      .then(res => {
        const followers = res.data;
        this.setState({ followers });
      })

      axios.get(`https://api.github.com/users/${this.state.name}/following`)
      .then(res => {
        const following = res.data;
        
        this.setState({ following });
      })

      axios.get(`https://api.github.com/users/${this.state.name}/repos`)
      .then(res => {
        if(res.data !==null){
        const oneRepoForUser = res.data[0].full_name;
        const reposDetails=res.data[0].private;
       
        this.setState({ oneRepoForUser });
        this.setState({reposDetails});
      }
      })
      
  }

  render() {
    let user=this.state.users;
    let follws='';
    let flwing='';

    this.state.followers.forEach((followers, index) => {
      if(follws === ''){
        console.log(follws)
           follws=followers.login;
      }
      else{
        follws=follws+', '+followers.login;
      }
    });

    this.state.following.forEach((following, index) => {
      if(flwing === ''){
        console.log(flwing)
        flwing=following.login;
      }
      else{
        flwing=flwing+', '+following.login;
      }
    });

    const columns = [{  
      Header: 'Following Name',  
      accessor: 'login'  
      }] 

    let msg='private';
    if(this.state.reposDetails !== 'true')
    {
      msg ='public';
    }
    return (
    <div>


<h2  style={{ color: 'green' }}> Git User Details Implementation</h2>
{this.state.errorMsg !== '' &&
<h1 style={{ color: 'red' }}>{this.state.errorMsg}</h1>
}



<form onSubmit={this.handleSubmit}>
          <label>
            Enter the Git UserName:
            <input type="text" name="name" onChange={this.handleChange} />
          </label>
          <button type="submit">Click to Get Details</button>
        </form> <br/>

       <h2 style={{ color: 'green' }}>Home :</h2>
      
       {follws.length >0 &&
       <table border="1px" >
 <thead>
  <tr>
    <th>
    UserName
   </th>
   <th>
    Followers
    </th>
    <th>
      Following
    </th>
  </tr>
 </thead>
<tbody>
 <td>
  {user.name}
 </td>
 <td>
  {follws}
 </td>
 <td>
   {flwing}
 </td>

</tbody>
</table>
  }
  
   
<h2 style={{ color: 'green' }}>Repo :</h2>

{this.state.oneRepoForUser !== '' &&

<table border ="1px">
  <td>
        User The {user.name} with {user.followers} followers
          is following {user.following}. One repo for this 
           user is {this.state.oneRepoForUser}  and it is {msg}
           </td>
           </table>
}
<h2 style={{ color: 'green' }}>Following :</h2>
{this.state.following.length > 0 &&
<ReactTable      data={this.state.following}  
                  columns={columns}  
                  defaultPageSize = {10}  
                  pageSizeOptions = {[10]}  
              /> 
  }


      </div>
    )
  }





}