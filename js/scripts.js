window.onload = function() {

  // var namesEl = document.querySelector('.names');
  var messagesEl = document.querySelector('.messages');
  var typingSpeed = 20;
  var loadingText = '<b>•</b><b>•</b><b>•</b>';
  var messageIndex = 0;

  var getCurrentTime = function() {
    var date = new Date();
    var hours =  date.getHours();
    var minutes =  date.getMinutes();
    var current = hours + (minutes * .01);
    if (current >= 5 && current < 19) return 'Have a nice day'; // It's called greeting the intelligent way ! 
    if (current >= 19 && current < 22) return 'Have a nice evening'; // It's called greeting the intelligent way ! 
    if (current >= 22 || current < 5) return 'Have a good night'; // It's called greeting the intelligent way ! 
  }

  var names = [
  'FOSSASIA Mentors'
  ]

  var messages = [
    'Hi! I\'m Piyush Raj A.K.A <a target="_blank" href="https://github.com/0x48piraj">@0x48piraj</a>',
    'I made this application just to make my family smile. :)',
    'Here are some words our mentors want to share!',
    '<a target="_blank" href="https://github.com/ParthS007">@ParthS007</a> : <br> First of all, I would like to thank FOSSASIA for providing me this opportunity to mentor young talent. I have never thought that students will be such enthusiastic about open-source and as the program is approaching to it\'s end and I am happy that students are now contributing to main stream projects finding bugs , creating Issues and solving them.Some students are doing extraordinary well in terms of their code quality and helping others as well which is important in community. At last , I only say that GCI is a great program by Google which helps students a lot to increase their thinking in terms of technology and these students can be a part of great innovation in coming future.',
   // '<a target="_blank" href="https://twitter.com/0x48piraj">twitter.com/0x48piraj</a><br><a target="_blank" href="https://github.com/0x48piraj">github.com/0x48piraj</a><br><a target="_blank" href="https://www.linkedin.com/in/0x48piraj/">linkedin.com/0x48piraj</a>',
    getCurrentTime(),
    'Guess how I knew it!'
  ]

  var getFontSize = function() {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  }

  var pxToRem = function(px) {
    return px / getFontSize() + 'rem';
  }

  var createBubbleElements = function( name, message, position) {
    var bubbleEl = document.createElement('div');
    var nameEl = document.createElement('div');
    var messageEl = document.createElement('span');
    var loadingEl = document.createElement('span');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    bubbleEl.classList.add('cornered');
    bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
    messageEl.classList.add('message');
    nameEl.classList.add('name');
    loadingEl.classList.add('loading');
    nameEl.innerHTML = name;
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(nameEl);
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
   
    return {
      name: nameEl,
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    }
  }

  var getDimentions = function(elements) {
    return dimensions = {
      name: {
        w: pxToRem(elements.name.offsetWidth + 8),
        h: pxToRem(elements.name.offsetHeight + 8)

      },
      loading: {
        w: '4rem',
        h: '2.25rem'
      },
      bubble: {
        w: pxToRem(elements.bubble.offsetWidth + 4),
        h: pxToRem(elements.bubble.offsetHeight)
      },
      message: {
        w: pxToRem(elements.message.offsetWidth + 4),
        h: pxToRem(elements.message.offsetHeight)
      }
    }
  }

  var sendMessage = function(name, message, position) {
    var loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + 500;
    var elements = createBubbleElements(name, message, position);
    messagesEl.appendChild(elements.name);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement('br'));
    var dimensions = getDimentions(elements);
    elements.bubble.style.width = '0rem';
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = 1;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      var scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ['0rem', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, .95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic',
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('b'),
      scale: [1, 1.25],
      opacity: [.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function(i) {return (i * 100) + 50}
    });
    setTimeout(function() {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function(a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w ],
        height: [dimensions.loading.h, dimensions.bubble.h ],
        marginTop: 0,
        marginLeft: 0,
        begin: function() {
          if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
        }
      })
    }, loadingDuration - 50);
  }

  var sendMessages = function() {
    var message = messages[messageIndex];
    var name = names;
    if (!message) return;
    sendMessage(name, message);
    ++messageIndex;
    setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + anime.random(900, 1200));
  }

  sendMessages();

}
