
function leaking(index){
  if (index === 0) return '∅';
  return index.toString() + '+';
}

var Recorder = {
  props: ['fingering'],
  setup(props) {
    const numbers = ref(props.fingering);
    function insert(i){
      const char = i.toString();
      for (let j = 0; j <= numbers.value.length; j++){
          let pivot = numbers.value[j];
          if (pivot === '∅') {
            pivot = '0';
          }
          if (j == numbers.value.length || pivot > char) {
            numbers.value = numbers.value.slice(0, j) + char + numbers.value.slice(j);
            break;
          }
        }
    }
    function toggle(i){
      const char = i.toString();
      if (numbers.value.includes(leaking(i))){
        numbers.value = numbers.value.replace(leaking(i), '');
      } else if (numbers.value.includes(char)){
        numbers.value = numbers.value.replace(char, leaking(i));
      } else {
        insert(i);
      }
    }
    return {
      numbers,
      toggle,
      leaking
    }
  },
  /*html*/
  template: `
<div class="frame">
  <input type="text" v-model="numbers" placeholder="-">
  <div class="instrument">
    <span v-for="(_, i) in 8"
      :key="i" class="hole"
      :class="[numbers.includes(leaking(i)) ? 'leaking' : numbers.includes(i) ? 'closed' : 'open', 'hole-' + i.toString()]"
      @click.left="toggle(i)"
      @click.right.prevent="vent(i)">
      {{ i }}
    </span>
  </div>
</div>
`
};
