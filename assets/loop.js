const loop = document.querySelector('#rating')
const sm = document.querySelector('.smb')


loop.addEventListener('change', function(data){
    sm.innerText = this.value
})
