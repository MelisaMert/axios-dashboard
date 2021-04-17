const getBtn = document.getElementById('get');
const postBtn = document.getElementById('post');
const putPatchBtn = document.getElementById('put-patch');
const deleteBtn = document.getElementById('delete');
const requestBtn = document.getElementById('request');
const headerBtn = document.getElementById('headers');
const errorsBtn = document.getElementById('errors');


getBtn.addEventListener('click', getData);
postBtn.addEventListener('click', postData);
putPatchBtn.addEventListener('click', putPatchData);
deleteBtn.addEventListener('click', deleteData);
requestBtn.addEventListener('click', requestData);
headerBtn.addEventListener('click', customHeader);
errorsBtn.addEventListener('click', errorOperation);


axios.interceptors.request.use(config => {
    console.log(`request ${config.method} to ${config.url} address`)
    return config;
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
    return Promise.reject(error);
});

axios.defaults.headers.common['X-Auth-Token'] = 'apiToken';
axios.defaults.headers.common['MyToken'] = 'myToken';

const axiosObject = axios.create({
   baseURL:'https://jsonplaceholder.typicode.com',
   headers:{
     'X-Requested-With': 'XMLHttpRequest',
     'token': 'myToken'
   } 
})

//_limit=1 query param
function getData() {
    console.log('getData Running');
    axios('https://jsonplaceholder.typicode.com/users?_limit=1')
        .then(response => writeResultToScreen(response))
        .catch(error => console.log(error))
        .then(() => console.log('Get Request Completed'))
}

function postData() {
    console.log('postData Running');
    axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: 'New Title',
        body: 'Body Section',
        userId: 55
    }).then(response => writeResultToScreen(response))
        .catch(error => console.log(error))
        .then(() => console.log('Post Request Completed'))

    axios.post('https://jsonplaceholder.typicode.com/users', {
          name: 'Marry Jane',
          username: 'MaryJane',
          email: "maryjane@outlook.com"
    }).then(response => writeResultToScreen(response))
    .catch(error => console.log(error))
}
// 1 request param 
// put just {} value , override other values
// pathch doesnt  override other values (general usage)
function putPatchData() {
   axios.patch('https://jsonplaceholder.typicode.com/users/1', {
      name: "Marry Jane",
      username: "Mary Suzan Jane",
      email: "maryjane@outlook.com"
   }).then(response => writeResultToScreen(response))
   .catch(error => console.log(error))
}

function deleteData(){
 axios.delete('https://jsonplaceholder.typicode.com/users/1')
 .then(response => writeResultToScreen(response))
 .catch(error => console.log(error));
}

// Spread to result
function requestData() {
    axios.all([
       axios.get('https://jsonplaceholder.typicode.com/users?_limit=1'),
       axios.get('https://jsonplaceholder.typicode.com/posts?_limit=1')
    ]).then(axios.spread((users,posts) => {
        console.log(users);
        console.log(posts);
        writeResultToScreen(users);
    }))
}

// Constrain request in header
function customHeader() {
    axiosObject.get('/users?_limit=1').then(response => writeResultToScreen(response));

    const config = {
       headers: {
           'Content-Type':'application/json',
           Authorization: 'token'
       }
    }

    axios.post('https://jsonplaceholder.typicode.com/posts', {
        title: 'New Title',
        body: 'Body Section',
        userId: 55
    },config).then(response => writeResultToScreen(response))
        .catch(error => console.log(error))
        .then(() => console.log('Post Request Completed'))
}

function errorOperation() {
    axios('https://jsonplaceholder.typicode.com/usersfsfdfd?_limit=1')
    .then(response => writeResultToScreen(response))
    .catch(error => writeError(error))
    .then(() => console.log('Get Request Completed'))
}

function writeError(error) {
    document.querySelector('.result').innerHTML = `
    <div class="notification is-info">
    <div class="columms is-mobile is-vcentered">
         <div class="column"><h1 class="subtitle">Result</h1></div>
         <div class="column"><h1 class=title>
         <pre>${JSON.stringify(error.response,null,2)}</pre>
         <h1></div>
    </div>
    </div>
    `
}

function writeResultToScreen(response) {
    document.querySelector('.result').innerHTML = `  
       
    <div class="section">
            <article class="message is-success">
                <div class="message-header">
                    <p>Status</p>${response.status}
                </div>
                <div class="message-body has-background-white has-text-dark">
                    <pre>${JSON.stringify(response.headers, null, 4)}<pre>
                </div> 
            </article>
    </div>
    <div class="section">
            <article class="message is-info">
                <div class="message-header">
                    <p>Data</p>
                </div>
                <div class="message-body has-background-white has-text-dark">
                   <pre>${JSON.stringify(response.data, null, 4)}</pre>
                </div> 
            </article>
    </div>
    <div class="section">
            <article class="message is-warning">
                <div class="message-header">
                  <p>Config</p>
                </div>
           <div class="message-body has-background-white has-text-dark">
           <pre>${JSON.stringify(response.config, null, 4)}</pre>
        </div> 
    </article>
    </div>
    `
}
