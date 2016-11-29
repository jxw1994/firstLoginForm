import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom'
import Validator from '../util/Validator';
import {Button, FormGroup, FormControl, ControlLabel, Input, Col, HelpBlock, Modal, Checkbox} from 'react-bootstrap';

class LoginForm extends React.Component{
     constructor(props){
        super(props);
        this.state={
              loginState:false,  
              unameHelp: "",
              upwdHelp: "",  
              msg:"",
              emailError:"",
              user:{}
          }
        this.userNamePlaceholder = "请输入用户名";
        switch(this.props.validator.type){
          case "email":
              this.userNamePlaceholder = "请输入邮箱号";
              break;
          case "mobile":
              this.userNamePlaceholder = "请输入手机号";
              break;
          case "emailOrMobile":
              this.userNamePlaceholder = "请输入邮箱/手机号";
              break;
        }
        
     }

     loginBtnClick(){
        var flag = this.checkName(this.refs.nameInput.value);
        flag = this.checkPwd(this.refs.pwdInput.value)&&flag
        if(!flag){
          return;
        }     
        $.ajax({
          url:"/login",
          type:"post",
          data: JSON.stringify({userName:this.refs.nameInput.value,pwd:this.refs.pwdInput.value}),
          dataType: 'json',
          contentType : 'application/json',
          success:function(data){
              if(data.status > 0){
                  this.setState({
                    loginState: true, 
                    user : data.data
                  });
                  //window.location.href="index";
              }else{
                  this.setState({
                    loginState: false,
                    msg : data.msg,
                  });
              }
          }.bind(this),
          error:function(){
              alert("请求失败");
          }
      });
     }
      /********检查用户名********/
      nameChange(e){
          let name = e.target.value;         
          var error="";        
          this.checkName(name);        
      }

      checkName(name){
          var type = this.props.validator.type||"";
          var errors = "";
          if(name === ""||name === null){
            errors += "* 用户名不能为空";
          }else if(type == "email"){
            if(!Validator.checkEmail(name))
              errors += "邮箱格式不正确";
          }else if(type == "mobile"){
            if(!Validator.checkMobile(name))
              errors += "手机号码格式不正确";
          }else if(type == "emailOrMobile"){
             if(!(Validator.checkEmail(name)||Validator.checkMobile(name)))
              errors += "邮箱/手机格式不正确";
          }else if(type == "checkMinLength"){
            if(!Validator.checkMinLength(name))
              errors += "长度小于"+this.props.validator.min_length;
          }
          if (errors){
            this.setState({
                unameHelp: errors,
            })
            return false;
          }else{
            this.setState({
                unameHelp: ""
            })
            return true;
          }    
      }

      /********检查密码********/
      pwdChange(e){
          let pwd = e.target.value;
          this.checkPwd(pwd);
      }

      checkPwd(pwd){
          var pwdtype = this.props.validator.pwdtype||"";
          var perrors = "";
          if(pwd === ""||pwd === null){
              perrors += "* 密码不能为空";
          }else if (pwdtype == "pwdFormat") {
              if (!(Validator.checkMinLength(pwd))){
                   perrors += "* 长度在6-12位之间";
              }else if(!(Validator.checkCombination(pwd))) {
                   perrors += "* 数字和字母的组合";
              }
          }
         if (perrors){
           this.setState({
              upwdHelp: perrors,
          })
          return false;
        }else{
          this.setState({
              upwdHelp: ""
          })
          return true;
        }         
      }

    render(){
        if(this.state.loginState==false){
            var value=this.state.value; 
            return(
                <div>
                  <form action="#">
                    <h3>登录管理</h3>
                    {this.state.msg}    
                    <div style={{marginTop:15}}>
                        <label>账号：</label>
                        <input type="text" name="username" id="username"  ref="nameInput"  placeholder={this.userNamePlaceholder}  onBlur={this.nameChange.bind(this)} /> 
                        <span style={{color:"red"}}>{this.state.unameHelp}</span> <br/>                        

                        <label>密码：</label>
                        <input type="password" name="password" id="upwd" ref="pwdInput" placeholder="请输入密码"  onBlur={this.pwdChange.bind(this)}/> 
                        <span style={{color:"red"}}>{this.state.upwdHelp}</span>
                    </div>
                    <div style={{marginLeft:43,marginTop:10}}>
                        <Button bsStyle="primary" style={{width:51,height:32,marginRight:15}} name="btnlogin" onClick={this.loginBtnClick.bind(this)} >登录</Button>
                        <Button bsStyle="primary" style={{width:51,height:32,marginRight:15}} name="btnreset" >取消</Button> 
                    </div>
                  </form> 
                </div>
           );
        }else{
            return(
                <div style={{marginTop:30}}>
                  {this.state.user.userName}你好,欢迎登陆管理系统,所属的部门是:{this.state.user.department} 
                </div>
            );
        }
    }
};
//type: email, mobile, ... emailOrMobile pwd
//手机或邮箱
//props 
ReactDOM.render(
       <LoginForm  validator={{type:"emailOrMobile",pwdtype:"pwdFormat",min_length:10, not_null:true}} />,     
       // <LoginForm  validator={type:"email", min-length:10}/>,     
       document.getElementById("form_content")
);
