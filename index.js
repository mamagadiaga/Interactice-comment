// Charger les données des commentaires à partir du fichier JSON ou du localStorage
let db;

if (localStorage.getItem('comments')) {
  db = JSON.parse(localStorage.getItem('comments'));
} else {
  fetch('./db.json')
    .then(response => response.json())
    .then(data => {
      db = data;
      localStorage.setItem('comments', JSON.stringify(db));
      renderComments();
    })
    .catch(error => console.log(error));
}

// Fonction pour ajouter une réponse à un commentaire
function addReply(commentId, reply) {
  const comment = db.comments.find(c => c.id === commentId);

  if (!comment.replies) {
    comment.replies = [];
  }
  
  const newReply = {
    id: Date.now(),
    content: reply,
    createdAt: new Date().toLocaleString(),
    score: 0,
    user: {
      image: {
        png: './images/avatars/image-juliusomo.png',
        webp: './images/avatars/image-juliusomo.webp'
      },
      username: 'juliusomo'
    }
  };
  

  comment.replies.push(newReply);

  localStorage.setItem('comments', JSON.stringify(db));
  renderComments();
}

// Fonction pour afficher le formulaire de réponse à un commentaire
function createReplyForm(commentId, div) {
  const replyForm = document.createElement('form');
  replyForm.className = 'reply-form';
  replyForm.innerHTML = `
    <div class="form-group">
      <textarea id="reply-text" class="form-control" rows="3"></textarea>
    </div>
    <button type="submit" class="btn btn-primary">Send</button>
  `;
  li.appendChild(replyForm);

  replyForm.addEventListener('submit', event => {
    event.preventDefault();
    const replyText = replyForm.querySelector('#reply-text').value;
    const newReply = {
      id: Date.now(),
      content: replyText,
      createdAt: new Date().toLocaleString(),
      score: 0, 
      user: {
        image: {
          png: './images/avatars/image-juliusomo.png',
          webp: './images/avatars/image-juliusomo.webp'
        },
        username: 'juliusomo'
      }
    };
    addReply(commentId, newReply);
    li.removeChild(replyForm);
  });
}


// Fonction pour afficher les commentaires
function renderComments() {
  const commentsList = document.getElementById('comments-list');
  commentsList.innerHTML = '';

  db.comments.forEach(comment => {
    const div = createCommentElement(comment);
    commentsList.appendChild(div);

    const replyButton = div.querySelector('.btn-reply');
    replyButton.addEventListener('click', () => {
    
      const replyForm = div.querySelector('.reply-form');
      if (replyForm) {

        div.removeChild(replyForm);
      } else {

        createReplyForm(comment.id, div);
      }
    });

    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        const replyLi = createCommentElement(reply, true);
        div.querySelector('.replies').appendChild(replyLi);
      });
    }
  });
}

  

let comments = JSON.parse(localStorage.getItem('comments'));


if (!comments) {
  comments = [];
}

// Afficher les commentaires
const commentsList = document.getElementById('comments-list');

fetch('./db.json')
  .then(response => response.json())
  .then(data => {
    db = data;
    localStorage.setItem('comments', JSON.stringify(db));
    renderComments();
  })
  .catch(error => {
    console.log(error);
    db = {};
    renderComments();
  });

  function createCommentElement(comment, isReply = false) {
    const div = document.createElement('div');
    div.classList.add('comment');
    if (isReply) {
      div.classList.add('comment-reply');
    }
  
    const img = document.createElement('img');
    img.src = comment.user.image.png;
    img.alt = comment.user.username;
    div.appendChild(img);
  
    const commentContent = document.createElement('div');
    commentContent.classList.add('comment-content');
    div.appendChild(commentContent);
  
    const commentHeader = document.createElement('div');
    commentHeader.classList.add('comment-header');
    commentContent.appendChild(commentHeader);
  
    const strong = document.createElement('strong');
    strong.textContent = comment.user.username;
    commentHeader.appendChild(strong);
  
    const commentDate = document.createElement('span');
    commentDate.classList.add('comment-date');
    commentDate.textContent = comment.createdAt;
    commentHeader.appendChild(commentDate);
  
    const commentText = document.createElement('p');
    commentText.classList.add('comment-text');
    commentText.textContent = comment.content;
    commentContent.appendChild(commentText);
  
    const replyButton = document.createElement('button');
    replyButton.classList.add('btn-reply');
    replyButton.textContent = 'Reply';
    commentContent.appendChild(replyButton);
  
    const replyScore = document.createElement('div');
    replyScore.classList.add('reply-score');
    commentContent.appendChild(replyScore);
  
    const plusButton = document.createElement('button');
    plusButton.classList.add('score-btn', 'score-btn-plus');
    plusButton.textContent = '+';
    replyScore.appendChild(plusButton);
    
    const scoreCounter = document.createElement('span');
    scoreCounter.textContent = comment.score;
    replyScore.appendChild(scoreCounter);
  
    const minusButton = document.createElement('button');
    minusButton.classList.add('score-btn', 'score-btn-minus');
    minusButton.textContent = '-';
    replyScore.appendChild(minusButton);
  
    const repliesList = document.createElement('div');
    repliesList.classList.add('replies');
    commentContent.appendChild(repliesList);
  
    plusButton.addEventListener('click', () => {
      comment.score++;
      scoreCounter.textContent = comment.score;
    });
  
    minusButton.addEventListener('click', () => {
      if (comment.score > 0) {
        comment.score--;
        scoreCounter.textContent = comment.score;
      }
    });
  
    replyButton.addEventListener('click', () => {
      const replyForm = document.createElement('form');
      replyForm.classList.add('reply-form');
  
      const formGroup = document.createElement('div');
      formGroup.classList.add('form-group');
      replyForm.appendChild(formGroup);
  
      const label = document.createElement('label');
      label.htmlFor = 'reply-text';
      formGroup.appendChild(label);
  
      const textarea = document.createElement('textarea');
      textarea.id = 'reply-text';
      textarea.classList.add('form-control');
      textarea.rows = 3;
      formGroup.appendChild(textarea);
  
      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.classList.add('btn', 'btn-primary', 'submit-btn');
      submitButton.textContent = 'Send';
      replyForm.appendChild(submitButton);
  
      commentContent.appendChild(replyForm);
  
      submitButton.addEventListener('click', event => {
        event.preventDefault();
        const replyText = textarea.value;
        addReply(comment.id, replyText);
        commentContent.removeChild(replyForm);
      });
    });
  
    return div;
  }
  


  
//BOUTON SEND
// Définir une variable pour stocker les commentaires
let mcomments = [];

function addComment(comment) {
  const commentsList = document.getElementById('comments-list');
  const div = document.createElement('div');
  div.className = 'comment';
  div.innerHTML = `
    <p>${comment.content}</p>
  `;
  commentsList.appendChild(div);

  mcomments.push(comment);
  localStorage.setItem('comments', JSON.stringify(mcomments));
}

// Ajouter un nouveau commentaire lorsqu'on clique sur le bouton "Send"
document.getElementById('comment-send-btn').addEventListener('click', event => {
  event.preventDefault();

  const comment = document.getElementById('comment').value;

  const newComment = {
    id: Date.now(),
    content: comment,
    createdAt: new Date().toLocaleString(),
    score: 0, 
    user: {
      image: {
        png: './images/avatars/image-john.png',
        webp: './images/avatars/image-john.webp'
      },
      username: 'john'
    }
  };
  
  addComment(newComment);

  document.getElementById('comment').value = '';
});

// Ajouter un nouveau commentaire lorsqu'on clique sur le bouton "Send" (mobile)
document.getElementById('comment-send-btn-mobile').addEventListener('click', event => {
  event.preventDefault();

  const comment = document.getElementById('comment').value;

  const newComment = {
    id: Date.now(),
    content: comment,
    createdAt: new Date().toLocaleString(),
    score: 0, 
    user: {
      image: {
        png: './images/avatars/image-john.png',
        webp: './images/avatars/image-john.webp'
      },
      username: 'john'
    }
  };
  

  addComment(newComment);

  document.getElementById('comment').value = '';
});
