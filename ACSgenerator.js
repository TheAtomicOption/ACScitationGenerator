    /*
    * Sourced js text preview functions from: http://inimino.org/~inimino/blog/javascript_live_text_input
    */

    function reverse(s){return s.split('').reverse().join('')}

    function replaceNull(test,replacement){
    if(test == -1) return replacement; else return test;
    }

    function set(el,text){
    while(el.firstChild)el.removeChild(el.firstChild);
    el.appendChild(document.createTextNode(text))}

    /* setupUpdater will be called once, on page load.*/

    function setupUpdater(){
        var lastname=document.getElementById('lastname')
        , title=document.getElementById('title')
        , year=document.getElementById('year')
        , FullCitation=document.getElementById('FullCitation')
        , InTextCitation=document.getElementById('InTextCitation')
        , oldText=FullCitation.value
        , oldInText=InTextCitation.value
        , timeout=null;

      /* handleChange is called 50ms after the user stops
      typing. */

          function handleChange(){
              var newCitation=lastname.value + ' ' + title.value + ' ' + year.value;
              if (newCitation==oldText) return; else oldText=newCitation;
              set(FullCitation, newCitation);

              var newInText='('+lastname.value.substr(0,replaceNull(lastname.value.indexOf(';'),lastname.value.length))
              +', ' + year.value + ')';

              /*if (newInText==oldInText) return; else oldInText=newInText;*/
              if (newInText==oldInText) return; else oldInText=newInText;
              set(InTextCitation, newInText);
          }


          /* eventHandler is called on keyboard and mouse events.
          If there is a pending timeout, it cancels it.
          It sets a timeout to call handleChange in 50ms. */
          function eventHandler(){
          if(timeout) clearTimeout(timeout);
          timeout=setTimeout(handleChange, 50);
          }

        lastname.onkeydown=lastname.onkeyup=lastname.onclick=
        title.onkeydown=title.onkeyup=title.onclick=
        year.onkeydown=year.onkeyup=year.onclick=eventHandler;
    }

    setupUpdater();
    document.getElementsByTagName('input')[0].focus();