import * as React from "react";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";
import Graph from "./Graph";
import Selector from "./Selector";
const App = (): JSX.Element => {
  // defining state variables and functions
  const [graphIntervalId, setGraphInvervalId] =
    React.useState<NodeJS.Timeout | null>(null);
  const [tableIntervalId, setTableIntervalId] =
    React.useState<NodeJS.Timeout | null>(null);
  const [loginStatus, changeLoginStatus] = React.useState<boolean>(false);
  const [loginAttempt, changeAttempt] = React.useState<string | null>(null);
  const [signUpStatus, changeSignUpStatus] = React.useState<boolean>(false);
  const [currentUser, changeUser] = React.useState<string>("");
  const [rendering, setRendering] = React.useState<boolean>(false);
  const [topic, setTopic] = React.useState<string>("");
  const [topicList, setTopicList] = React.useState<string[]>([]);
  const [bootstrap, setBootstrap] = React.useState<string>("");
  const [serverList, setServerList] = React.useState<string[]>([]);
  const [freshCookies, getCookies] = React.useState<boolean>(false);
  //graph rendering state ->
  const [data, setData] = React.useState<
    Array<{ time: number; value: number }>
  >([]);

  // login button function
  const loginButton = () => {
    // username is input value in usernmae field
    const username: string | null = (
      document.querySelector("#username") as HTMLInputElement
    ).value;

    // password is input value in password field
    const password: string | null = (
      document.querySelector("#password") as HTMLInputElement
    ).value;

    // if username or password are empty inputs, display error message
    if (username == "" || password == "") {
      const result = "Please enter your username and password to log in";
      changeAttempt(result);

      // if username and password are filled out, send fetch request to backend to see if user/ pw is correct
    } else {
      const user: { username: string; password: string } = {
        username,
        password,
      };

      fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        // if username or password are empty, have user try again
        .then((res) => {
          if (res.status === 200) {
            changeUser(username);
            changeLoginStatus(true);
          } else {
            changeAttempt("Incorrect username or password. Please try again.");
          }
        })
        .catch((err) => {
          changeAttempt("Incorrect username or password. Please try again.");
          console.log(err);
        });
    }
  };

  const signUpButton = () => {
    changeSignUpStatus(!signUpStatus);
  };

  // Sign Up functionality
  const signUp = () => {
    const username: string | null = (
      document.querySelector("#username") as HTMLInputElement
    ).value;
    const password: string | null = (
      document.querySelector("#password") as HTMLInputElement
    ).value;

    if (username == "" || password == "") {
      const result = "Please fill out the username and password fields";
      changeAttempt(result);
    } else if (password.length < 6) {
      const result = "Please create a strong password longer than 6 characters";
      changeAttempt(result);
    } else {
      const user: { username: string; password: string } = {
        username: username,
        password: password,
      };
      fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((res) => {
          if (res.status == 200) {
            alert("Signup Successful! Please login to proceed.");
            location.reload();
          }
          else changeAttempt('User already exists. Please try a different username.')
        })
        .catch((err) => console.log(err));
    }
  };

  const logOut = async () => {
    fetch("http://localhost:3001/logout"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentUser),
      };
    changeUser("");
    changeLoginStatus(false);
    changeAttempt(null);
  };

  React.useEffect(() => {
    setRendering(false);
  }, []);
  if (!rendering) {
    // check / fetch fresh cookies from browser

    // if(!freshCookies) {
    //   (async () => {
    //     try{
    //     const res = await (await fetch('http://localhost:3001/sessions')).json();
    //     getCookies(true);
    //     if (res !== []) {
    //       const username: string = res;
    //       changeLoginStatus(true);
    //       changeUser(username);
    //     }
    //   } ;
    // }

    if (signUpStatus === true) {
      return (
        <div key="signUpPage">
          <SignUpPage
            signUp={signUp}
            loginAttempt={loginAttempt}
          />
        </div>
      );
    } 
    if (loginStatus === false) {
      return (
        <div key="loginPage">
          <LoginPage
            loginAttempt={loginAttempt}
            loginButton={loginButton}
            signUpButton={signUpButton}
          />
        </div>
      );
    } else if (loginStatus === true) {
      return (
        <div key="selector">
          <Selector
            logOut={logOut}
            currentUser={currentUser}
            graphIntervalId={graphIntervalId}
            setGraphIntervalId={setGraphInvervalId}
            tableIntervalId={tableIntervalId}
            setTableIntervalId={setTableIntervalId}
            setData={setData}
            setTopic={setTopic}
            bootstrap={bootstrap}
            setBootstrap={setBootstrap}
            topicList={topicList}
            setTopicList={setTopicList}
            serverList={serverList}
            setServerList={setServerList}
          />
          <Graph data={data} />
        </div>
      );
    } else {
      return <div key="loadingMessage">Loading, please wait!</div>;
    }
  }
};

export default App;
