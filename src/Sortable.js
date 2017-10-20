class Sortable{
  constructor(step_x, step_y, delta){
    this.state = {
      delta: delta,
      step_x:step_x,
      step_y:step_y,
      mouseX: 0,
      mouseY: 0,
      lastPress: null,
      isPressed: false,
      currentRow:null,
      currentCol:null,
      // order: [
      //   [1, 2, 3, 4, 5, 6],
      //   [11, 12, 13, 14, 15, 16],
      //   [21, 22, 23, 24, 25, 26]
      // ],
      order:[
        {id: 1, w:1, h:1, col:1, row:1},
        {id: 2, w:1, h:1, col:2, row:1},
        {id: 3, w:1, h:1, col:3, row:1},
        {id: 4, w:1, h:1, col:4, row:1},
        {id: 5, w:2, h:2, col:5, row:1},
        {id: 6, w:1, h:1, col:6, row:1},
        {id: 7, w:1, h:1, col:7, row:1},
        {id: 8, w:1, h:1, col:8, row:1},
        {id: 9, w:1, h:1, col:9, row:1},

        {id: 11, w:1, h:1, col:1, row:2},
        {id: 12, w:1, h:1, col:2, row:2},
        {id: 13, w:1, h:1, col:3, row:2},

        {id: 21, w:1, h:1, col:1, row:3},
        {id: 22, w:1, h:1, col:2, row:3},
        {id: 23, w:1, h:1, col:3, row:3},
      ]
    };
  }

  clamp(n, min, max) {
    return Math.max(Math.min(n, max), min);
  }

  get_state(){
    // let temp = this.state
    let res_order = []
    let copy = Object.assign({}, this.state);
    copy.order.forEach((value, key) => {
      let ttm = value
      ttm.width = ttm.w * copy.step_x + (ttm.w-1)*copy.delta
      ttm.height = ttm.h * copy.step_y + (ttm.h-1)*copy.delta
      ttm.y = ttm.row * (copy.step_y + copy.delta)
      ttm.x = ttm.col * (copy.step_x + copy.delta)
      res_order.push(ttm)
    })
    copy.order = res_order

    return copy
  }

  handleMouseMove({pageX, pageY}){
    const {isPressed, topDeltaY, topDeltaX, lastPress} = this.state;

    if (isPressed) {
      let copy = Object.assign({}, this.state);
      const mouseY = pageY - topDeltaY ;
      const currentRow = this.clamp(Math.round(mouseY / this.state.step_y), 1, 10);

      // console.log("currentRow", currentRow)
      // let newOrder = order;

      const mouseX = pageX - topDeltaX;
      const currentCol = this.clamp(Math.round(mouseX / this.state.step_x), 1, 10);
      // console.log("currentCol", currentCol)
      // let result = []
      // console.log("order[currentRow][currentCol]", order[currentRow][currentCol])
      let new_row = []
      let last_col = null
      let last_row = null
      let  w = null
      let h = null
      copy.order.forEach((value, key_y) => {
        if(lastPress.id===value.id){
          let cp_value = Object.assign({}, value);

          last_col = cp_value.col
          last_row = cp_value.row
          // width = cp_value.w * copy.step_x + (cp_value.w-1)*copy.delta
          // height = cp_value.h * copy.step_y + (cp_value.h-1)*copy.delta
          w = cp_value.w
          h = cp_value.h
          // console.log("w", w)
          // console.log("h", h)

          cp_value.col = currentCol
          cp_value.row = currentRow

          new_row.push(cp_value)
        }

      })
      copy.order.forEach((value, key_y) => {
        // console.log("value", value
        if(lastPress.id!==value.id){
          let cp_value = Object.assign({}, value);
          if(value.col === currentCol && value.row === currentRow){
            console.log("========",  value.id)
            if(currentCol >= this.state.currentCol){
              console.log("cp_value.col = last_col")
              cp_value.col = last_col
              if(currentRow > this.state.currentRow){
                console.log("cp_value.row = last_row")
                cp_value.row = last_row
              }else{
                cp_value.row = cp_value.row + (h)
                console.log("cp_value.row = cp_value.row + (h)")
              }
            }else{
              console.log("cp_value.col = cp_value.col + (w)")
              cp_value.col = cp_value.col + (w)
              if(currentRow > this.state.currentRow){
                console.log("cp_value.row = last_row")
                cp_value.row = last_row
              }
            }

            // if(currentRow > this.state.currentRow){
            //   console.log("cp_value.row = last_row")
            //   cp_value.row = last_row
            // }else{
            //   cp_value.row = cp_value.row + (h)
            //   console.log("cp_value.row = cp_value.row + (h)")
            // }
          }else{

            if(currentCol > this.state.currentCol && value.row >= currentRow && value.row <= (currentRow + (h-1))){
              if(value.col >= currentCol){
                console.log("Col>>>>>>>",  value.id)
                cp_value.col = cp_value.col + (w-1)
              }
            }
            // console.log("ser::", value.id, value.col)
            if(currentCol < this.state.currentCol && value.row >= currentRow && value.row <= (currentRow + (h-1))){
              if(value.col >= (currentCol) && value.col <= (currentCol+w)){
                console.log("Col<<<<<<<", value.id)
                cp_value.col = cp_value.col + (w)
              }
            }
            ////////////////////////////////////////////////////////
            // for rows
            if(currentRow > this.state.currentRow  && value.col >= currentCol && value.col <= (currentCol + (w-1))){
              if(value.row >= currentRow){
                console.log("Row++++++++",  value.id)
                cp_value.row = cp_value.row + (h-1)
              }
            }

            if(currentRow < this.state.currentRow && value.col >= currentCol && value.col <= (currentCol + (w-1))){
              if(value.row >= (currentRow) && value.row < (currentRow+h)){
                console.log("Row--------", value.id)
                cp_value.row = cp_value.row + (h)
              }
            }
            // if(value.col >= currentCol && value.col <= (currentCol + (w-1)) && value.row >= currentRow && value.row <= (currentRow + (h-1)) ){
            //   console.log("currentRow", currentRow)
            //   console.log("currentCol", currentCol)
            //   console.log("cp_value", cp_value)
            //   // console.log("cp_value.row", cp_value.row)
            //   console.log("width", w)
            //   console.log("height", h)
            //   console.log("state", this.state)
            //   if(currentCol > this.state.currentCol){
            //     cp_value.col = cp_value.col + (w-1)
            //   }
            //   if(currentCol < this.state.currentCol){
            //     cp_value.col = cp_value.col + (w+1)
            //   }
            //   // if(currentRow !== this.state.currentRow){
            //   //   cp_value.row = cp_value.row + (h-1)
            //   // }
            // }
            // if(value.row > currentRow && value.col >= (currentCol + (w-1))){
            //   if(currentRow !== this.state.currentRow){
            //     cp_value.row = cp_value.row + (h-1)
            //   }
            //   // cp_value.row = last_row
            // }
          }
          new_row.push(cp_value)
        }

      })
      // console.log("result", result)
      if(currentRow !== this.state.currentRow){
        this.state.currentRow = currentRow
      }
      if(currentCol !== this.state.currentCol){
        this.state.currentCol = currentCol
      }
      this.state.mouseY = mouseY
      this.state.mouseX = mouseX
      this.state.order = new_row

    }
  }

  handleMouseDown(pos, [pressX, pressY], {pageX, pageY}){
    this.state.lastPress = pos
    this.state.isPressed = true
    this.state.mouseY = pressY
    this.state.mouseX = pressX
    this.state.old_order = this.state.order
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
