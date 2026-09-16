(function(){
  var updates = window.desktopUpdates;
  var bar = document.getElementById('updateBar');
  if(!updates || !bar) return;

  var message = document.getElementById('updateMessage');
  var action = document.getElementById('updateAction');
  var progress = document.getElementById('updateProgress');

  function render(state){
    if(state.status === 'available'){
      bar.hidden = false;
      message.textContent = 'Hay una actualizacion disponible' + (state.version ? ' · v' + state.version : '');
      action.hidden = false;
      action.textContent = 'Actualizar ahora';
      action.onclick = function(){ updates.download(); };
    } else if(state.status === 'downloading'){
      bar.hidden = false;
      message.textContent = 'Descargando actualizacion · ' + (state.percent || 0) + '%';
      action.hidden = true;
      progress.hidden = false;
      progress.value = state.percent || 0;
    } else if(state.status === 'downloaded'){
      bar.hidden = false;
      message.textContent = 'Actualizacion lista para instalar';
      action.hidden = false;
      action.textContent = 'Reiniciar y actualizar';
      action.onclick = function(){ updates.install(); };
      progress.hidden = true;
    } else if(state.status === 'error'){
      bar.hidden = false;
      message.textContent = 'No se pudo comprobar la actualizacion';
      action.hidden = true;
      progress.hidden = true;
    }
  }

  updates.onState(render);
  updates.getState().then(render);
})();
