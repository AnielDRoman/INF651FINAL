//1
function createElemWithText(tagName = 'p', textContent = "", className){
  const elem = document.createElement(tagName);
  elem.textContent = textContent;
  if (className){
    elem.className = className;}
  return elem;
}


//2
function createSelectOptions(JsonData){
  if (!JsonData){
    return ;
  }

  const options = [];

  for (const user of JsonData){
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    // Add  options to array
    options.push(option);
  }

  return options;
    
}



//3
function toggleCommentSection(postId){
  if (!postId){
    return ;
  }
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (section){
      section.classList.toggle('hide');
    }
    return section;
  }
  

//4
function toggleCommentButton(postId){
  if (!postId){
    return ;
  }
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (button){
      button.textContent = (button.textContent === 'Show Comments') ? 'Hide Comments' : 'Show Comments';
    }
    return button;
  }



//5
function deleteChildElements(parentElement){
  if (!(parentElement instanceof HTMLElement)) return;
  let child = parentElement.lastElementChild;

  while (child){
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}




//"The next several functions have small dependencies"

//6

function addButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  if (buttons.length) {
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
      button.addEventListener('click', (event) => toggleComments(event, postId));
    });
  }
  return buttons;
}


//7
function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button'); //still need to check if this works...
    if (buttons.length) {
      buttons.forEach((button) => {
        const postId = button.dataset.postId;
        button.removeEventListener('click', (event) => toggleComments(event, postId));
      });
    }
    return buttons;
  }



//8

    function createComments(commentData){
      if (!commentData){
    return ;
  }
        // Create fragment element
        const fragment = document.createDocumentFragment();
      
        // Loop through comments
        for (const comment of commentData) {
          // Create article element
          const article = document.createElement('article');
      
          // Create an h3 element with comment name
          const name = createElemWithText('h3', comment.name);
      
          // Create a paragraph element with comment body
          const body = createElemWithText('p', comment.body);
      
          // Create a paragraph element with comment email
          const email = createElemWithText('p', `From: ${comment.email}`);
      
          article.appendChild(name);
          article.appendChild(body);
          article.appendChild(email);
      
          // Append  article element to fragment
          fragment.appendChild(article);
        }
      return fragment; 
       // Return
      

}


//9

function populateSelectMenu(users) {
  if (!users){
    return;}
    const selectMenu = document.getElementById('selectMenu');
    const options = createSelectOptions(users);
    if (options.length) {
      options.forEach((option) => selectMenu.appendChild(option));
    }
    return selectMenu;
  }
  
//"Next function use Async/Await to request data from an API"

//10
async function getUsers() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  
//11
async function getUserPosts(userId){
  if (!userId){
    return;}
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  
//12
async function getUser(userId){
  if (!userId){
    return;}
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  
//13
async function getPostComments(postId){
  if (!postId){
    return;}
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }
  
//14
async function displayComments(postId) {
  if (!postId){
    return;}
    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');
  
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
  
    return section;
  }
  
//15 RETURN
async function createPosts(posts) {
  if (!posts){
    return;}
    const fragment = document.createDocumentFragment();
  
    for (const post of posts) {
      const article = document.createElement('article');
  
      const h2 = createElemWithText('h2', post.title);
      const p1 = createElemWithText('p', post.body);
      const p2 = createElemWithText('p', `Post ID: ${post.id}`);
  
      const author = await getUser(post.userId);
      const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
      const p4 = createElemWithText('p', author.company.catchPhrase);
  
      const button = createElemWithText('button', 'Show Comments');
      button.dataset.postId = post.id;
  
      article.append(h2, p1, p2, p3, p4, button);
  
      const section = await displayComments(post.id);
      article.append(section);
  
      fragment.append(article);
    }
  
    return fragment;
  }
  
//16
async function displayPosts(posts){
    const main = document.querySelector('main');
    var fragment = document.createDocumentFragment();
      if(!posts){
        fragment = createElemWithText('p', 'Select an Employee to display their posts.', 'default-text');
        main.append(fragment);
        return fragment;
      }
  fragment = await createPosts(posts);
  main.append(fragment);
  
    return fragment;
  }
  
//"Procedural functions."

//17
function toggleComments(event, postId){
  if (!event || !postId){
    return;}
    event.target.listener = true;
  
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
  
    return [section, button];
  }
  
//18
async function refreshPosts(posts){
  if (!posts){
    return;}
    const main = document.querySelector('main')
    const removeButtons = removeButtonListeners();
    const x = deleteChildElements(main);
  
    const fragment = await displayPosts(posts);
  
    const addButtons = addButtonListeners();
  
    return [removeButtons, x, fragment, addButtons];
  }
  
//19
async function selectMenuChangeEventHandler(event){
  if(!event){return;}
    event.target.disabled = true;
  
    const userId = event.target.value || 1;
    const posts = await getUserPosts(userId);
  
    const refreshPostsArray = await refreshPosts(posts);
  
    event.target.disabled = false;
  
    return [userId, posts, refreshPostsArray];
  }
  
//20
async function initPage() {
    const users = await getUsers();
  
    const select = populateSelectMenu(users);
  
    return [users, select];
  }
  
//21 
function initApp() {
    initPage();
  
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
  }
  
/*NOTE: There is one last step to get your app to function correctly. I cannot test for this, but you
must apply it to call the script into action.
*** This must be underneath the definition of initApp in your file.
1. Add an event listener to the document.
2. Listen for the “DOMContentLoaded” event.
3. Put initApp in the listener as the event handler function.
4. This will call initApp after the DOM content has loaded and your app will be started. */

document.addEventListener('DOMContentLoaded', initApp());
