
class Sortable{
  constructor(){
    this.state = {
      mouseX: 0,
      mouseY: 0,
      lastPress: null,
      isPressed: false,
      order: [
        [1, 2, 3, 4, 5, 6],
        [11, 12, 13, 14, 15, 16],
        [21, 22, 23, 24, 25, 26]
      ],
    };
  }

  clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
  }

  get_state(){
    return this.state
  }

  handleMouseMove({pageX, pageY}){
    const {isPressed, topDeltaY, topDeltaX, order, lastPress} = this.state;

    if (isPressed) {
      const mouseY = pageY -topDeltaY ;
      const currentRow = this.clamp(Math.round(mouseY / 100), 0, 10);
      console.log("currentRow", currentRow)
      // let newOrder = order;

      const mouseX = pageX-topDeltaX;
      const currentCol = this.clamp(Math.round(mouseX / 100), 0, 10);
      console.log("currentCol", currentCol)
      let result = []
      console.log("order[currentRow][currentCol]", order[currentRow][currentCol])
      let new_row = []
      order.forEach((_, key_y) => {
        if(key_y === currentRow){
          new_row = []
          order[key_y].forEach((current, key) => {
            if(currentCol === key){

              new_row.push(lastPress)

            }else{
              if(lastPress===current){
                new_row.push(order[currentRow][currentCol])
              }else{
                new_row.push(current)
              }
            }
          })
          result.push(new_row)
        }else{
          new_row = []
          order[key_y].forEach((current, key) => {
            if(lastPress===current){
              new_row.push(order[currentRow][currentCol])
            }else{
              new_row.push(current)
            }
          })
          result.push(new_row)
        }
      })
      console.log("result", result)
      this.state.mouseY = mouseY
      this.state.mouseX = mouseX
      this.state.order = result
    }
  }

  handleMouseDown(pos, [pressX, pressY], {pageX, pageY}){
    this.state.lastPress = pos
    this.state.isPressed = true
    this.state.mouseY = pressY
    this.state.mouseX = pressX
    this.state.topDeltaY = pageY - pressY
    this.state.topDeltaX = pageX - pressX
  }
  
  handleMouseUp(){
    this.state.isPressed = false
    this.state.topDeltaY = 0
    this.state.topDeltaX = 0
  }
}

export default Sortable;
