
// Update total based on user's quantity value
document.getElementById('quantity').addEventListener('input', function(e){
  let quantity = e.target.value;
  let totalPence = quantity * 1500;
  let totalPounds = quantity * 15;
  document.getElementById('total').innerHTML = "£" + totalPounds + '.00';
})
