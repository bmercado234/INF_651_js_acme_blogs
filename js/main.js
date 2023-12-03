function createElemWithText(elementName = 'p', textContent = '', className) {
     const newElem = document.createElement(elementName);
     newElem.textContent = textContent;
     if (className) {
          newElem.className = className;
     }
     return newElem;
}

function createSelectOptions(usersJData) {
     if (!usersJData) {
          return undefined;
     }

     const optionsArr = [];

     for (const user of usersJData) {
          const option = document.createElement("option");
          option.value = user.id;
          option.textContent = user.name;
          optionsArr.push(option);
     }

     return optionsArr;
}

function toggleCommentSection(postId) {
     if (postId == undefined) {
          return undefined;
     }
     const sectElem = document.querySelector(`section[data-post-id="${postId}"]`);
     if (sectElem) {
          sectElem.classList.toggle('hide');
     }
     else {
          return null;
     }

     return sectElem;
}

function toggleCommentButton(postId) {
     if (postId == undefined) {
          return undefined;
     }
     const sectButt = document.querySelector(`button[data-post-id="${postId}"`);
     if (sectButt) {
          if (sectButt.textContent == 'Show Comments') {
               sectButt.textContent = 'Hide Comments'
          }
          else if (sectButt.textContent == 'Hide Comments') {
               sectButt.textContent = 'Show Comments'
          }
     }
     else {
          return null;
     }

     return sectButt;
}

function deleteChildElements(parElem) {
     if (!(parElem instanceof Element)) {
          return undefined;
     }
     let childVar = parElem.lastElementChild;
     while (childVar) {
          parElem.removeChild(childVar);
          childVar = parElem.lastElementChild;
     }
     return parElem;
}

function addButtonListeners() {
     const butt = document.querySelectorAll('main button');
     if (butt.length > 0) {
          butt.forEach(button => {
               const postId = button.dataset.postId;
               if (postId) {
                    button.addEventListener('click', function (event) {
                         toggleComments(event, postId);
                    })
               }
          })
     }
     return butt;
}

function removeButtonListeners() {
     const butt = document.querySelectorAll('main button');
     butt.forEach(button => {
          const postId = button.dataset.id;
          if (postId) {
               const clickListen = function (event) {
                    toggleComments(event, postId);
               }
               button.removeEventListener('click', clickListen);
          }
     })
     return butt;
}

function createComments(comJData) {
     if (!comJData) {
          return undefined;
     }
     const fragment = document.createDocumentFragment();
     for (const comment of comJData) {
          const article = document.createElement('article');
          const h3 = createElemWithText('h3', comment.name);
          const bodPara = createElemWithText('p', comment.body);
          const emailPara = createElemWithText('p', `From: ${comment.email}`);

          article.appendChild(h3);
          article.appendChild(bodPara);
          article.append(emailPara);
          fragment.append(article);
     }
     return fragment;
}

function populateSelectMenu(userJData) {
     if (!userJData) {
          return undefined;
     }
     const selectMenu = document.getElementById('selectMenu');
     const options = createSelectOptions(userJData);
     for (const option of options) {
          selectMenu.appendChild(option);
     }
     return selectMenu;
}

async function getUsers() {
     try {
          const response = await fetch('https://jsonplaceholder.typicode.com/users')
          if (!response.ok) {
               throw new Error(`Error! ${response.status}`)
          }
          const userData = await response.json();
          return userData;
     }
     catch (error) {
          console.error('Could not fetch user data:', error);
          throw error;
     }
}

async function getUserPosts(userId) {
     if (!userId) {
          return undefined;
     }
     try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
          if (!response.ok) {
               throw new Error(`Error! ${response.status}`);
          }
          const postData = await response.json();
          return postData;
     } catch (error) {
          console.error('Could not fetch user post data:', error);
          throw error;
     }
}

async function getUser(userId) {
     if (!userId) {
          return undefined;
     }
     try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
          if (!response.ok) {
               throw new Error(`Error! ${response.status}`);
          }
          const user = await response.json();
          return user;
     } catch (error) {
          console.error('Could not fetch user', error);
          throw error;
     }
}

async function getPostComments(postId) {
     if (!postId) {
          return undefined;
     }
     try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
          if (!response.ok) {
               throw new Error(`Error! ${response.status}`);
          }
          const postComm = await response.json();
          return postComm
     } catch (error) {
          console.error('Could not fetch comment data', error);
          throw error;
     }
}

async function displayComments(postId) {
     if (!postId) {
          return undefined;
     }
     const sect = document.createElement('section');
     sect.dataset.postId = postId;
     sect.classList.add('comments', 'hide');
     const comments = await getPostComments(postId);
     const fragments = createComments(comments);
     sect.appendChild(fragments);
     return sect;
}

async function createPosts(postJData) {
     if (!postJData) {
          return undefined;
     }
     const fragment = document.createDocumentFragment();
     for (const post of postJData) {
          const article = document.createElement('article');
          const h2 = createElemWithText('h2', post.title);
          const bodyPar = createElemWithText('p', post.body);
          const IdPara = createElemWithText('p', `Post ID: ${post.id}`);
          const author = await getUser(post.userId);
          const authorText = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
          const authorPhrase = createElemWithText('p', `${author.company.catchPhrase}`);
          const butt = createElemWithText('button', 'Show Comments');
          butt.dataset.postId = post.id;
          article.append(h2);
          article.append(bodyPar);
          article.append(IdPara);
          article.append(author);
          article.append(authorText);
          article.append(authorPhrase);
          article.append(butt);
          const section = await displayComments(post.id);
          article.append(section);
          fragment.append(article);
     }
     return fragment;
}

async function displayPosts(postData) {
     const mainElem = document.querySelector('main');
     const defaultText = mainElem.querySelector('main p');
     let element;
     if (postData) {
          element = await createPosts(postData);
     }
     else {
          element = createElemWithText('p', 'Select an Employee to display their posts.');
          element.classList.add('default-text');
     }
     mainElem.append(element);
     return element;
}

function toggleComments(event, postId) {
     if (!event || !postId) {
          return undefined;
     }
     event.target.listener = true;
     const section = toggleCommentSection(postId);
     const butt = toggleCommentButton(postId);
     return [section, butt];
}

async function refreshPosts(postJData) {
     if (!postJData) {
          return undefined;
     }
     const removeButt = removeButtonListeners();
     const deleteChild = deleteChildElements(document.querySelector('main'));
     const fragment = await displayPosts(postJData);
     const addButt = addButtonListeners();
     return [removeButt, deleteChild, fragment, addButt];
}

async function selectMenuChangeEventHandler(event) {
     if (!event) {
          return undefined;
     }
     const userId = event?.target?.value || 1;
     const postJData = await getUserPosts(userId);
     const refreshP = await refreshPosts(postJData);
     return [userId, postJData, refreshP];
}

async function initPage() {
     const users = await getUsers();
     const select = populateSelectMenu(users);
     return [users, select];
}

function initApp() {
     initPage();
     const select = document.getElementById('selectMenu');
     select.addEventListener('change', selectMenuChangeEventHandler);
}

document.addEventListener('DOMContentLoaded', initApp);