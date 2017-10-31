const default_order = [
  {id: 1, w:1, h:1, col:1, row:1},
  {id: 2, w:1, h:1, col:2, row:1},
  {id: 3, w:2, h:2, col:3, row:1},
  {id: 4, w:1, h:1, col:5, row:1},
  {id: 5, w:1, h:1, col:6, row:1},

  {id: 11, w:1, h:1, col:1, row:2},
  {id: 12, w:1, h:1, col:2, row:2},
  {id: 13, w:1, h:1, col:5, row:2},
  {id: 14, w:1, h:1, col:6, row:2},

  {id: 21, w:1, h:1, col:1, row:3},
  {id: 22, w:1, h:1, col:2, row:3},
  // {id: 23, w:1, h:1, col:3, row:3},
]

class Sortable{
  constructor(step_x, step_y, delta, sortable_mode, order){
    order = order ? order : default_order
    this.state = {
      sortable_mode: sortable_mode ? sortable_mode: "default", // default, left_right
      size_mode: "default", // default, stick
      delta: delta ? delta: 5,
      step_x: step_x ? step_x: 90,
      step_y: step_y ? step_y: 90,
      mouseX: 0,
      mouseY: 0,
      lastPress: null,
      isPressed: false,
      currentRow:null,
      currentCol:null,
      order: order,
      init_size: this.get_init_size(order)
    };
  }

  get_init_size(order){
    let result = {}
    const copy_order = Object.assign([], order);
    copy_order.forEach((value, key) => {
      if(value.h > 1 || value.w > 1){
        result[`${value.row}_${value.col}`] = {w: value.w, h: value.h};
      }
    })
    console.log("get_init_size::", result)
    return result
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

  get_right_column_without_cur(row){
    let max_column = 0;
    const {lastPress} = this.state;
    let copy = Object.assign({}, this.state);
    copy.order.forEach((value, key_y) => {
      if(row === value.row ){
        if(value.col >= max_column){
          if(lastPress.id !== value.id){
            max_column = value.col
          }
        }
      }
    })
    return max_column
  }

  get_right_column(row){
    let max_column = 0;
    let copy = Object.assign({}, this.state);
    copy.order.forEach((value, key_y) => {
      if(row === value.row ){
        if(value.col >= max_column){
          max_column = value.col
        }
      }
    })
    return max_column
  }

  get_right_column_average(row){
    let max_column = 0;
    let copy = Object.assign({}, this.state);
    copy.order.forEach((value, key_y) => {
      if(row >= value.row ){
        if(value.col >= max_column){
          max_column = value.col
        }
      }
    })
    return max_column
  }

  move_item_right(item, width){
    console.log("move_item_right", item, ">>>", width)
    this.state.order.forEach((value, key) => {
      if(item.id === value.id){
        if(this.state.sortable_mode === "left_right"){
          const max_column = this.get_right_column(value.row)
          if(max_column === value.col){
            value.col = 1
            value.row += 1
          }else{
            value.col += width
          }
          value.w = 1
          value.h = 1
        }else{
          value.col += width
        }
      }
    })
  }

  move_item_left(item, width){
    console.log("move_item_right", item, ">>>", width)
    this.state.order.forEach((value, key) => {
      if(item.id === value.id){
        if(this.state.sortable_mode === "left_right"){
          if(value.col === 1){
            value.row -= 1
            value.col = (this.get_right_column_without_cur(value.row) + 1)
          }else{
            value.col -= width
          }
          value.w = 1
          value.h = 1
          let size, is_not_move;
          if(this.state.init_size[`${value.row}_${value.col-1}`]){
            size = this.state.init_size[`${value.row}_${value.col-1}`]
            is_not_move = false
          }
          if(this.state.init_size[`${value.row}_${value.col}`]){
            size = this.state.init_size[`${value.row}_${value.col}`]
            is_not_move = true
          }
          if(size){
            value.h = size.h
            value.w = size.w
            value.width = value.w * this.state.step_x + (value.w-1)*this.state.delta
            value.height = value.h * this.state.step_y + (value.h-1)*this.state.delta
            if(!is_not_move){
              this.move_item_left(value, 1)
            }
          }
        }else{
          value.col -= width
        }
      }
    })
  }

  move_item_bottom(item, width){
    console.log("move_item_bottom", item, "-----", width)
    this.state.order.forEach((value, key) => {
      if(item.id === value.id){
        value.row += width
      }
    })
  }

  move_item_top(item, width){
    console.log("move_item_bottom", item, "-----", width)
    this.state.order.forEach((value, key) => {
      if(item.id === value.id){
        value.row -= width
      }
    })
  }

  available_item(row, col){
    console.log("------------------")
    console.log("available_item", col, row)
    const {lastPress} = this.state;
    let item_cur = this.get_item_id(lastPress.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      if(
        item_cur.id !== value.id &&
        (value.col) <= col &&
        (value.col+value.w) > col &&
        (value.row) <= row &&
        (value.row + value.h) > row
      ){
        console.log("available_item:::value::", value)
        count+= 1;
      }
    })
    console.log("count::::", count)
    if(count > 0){
      return false
    }else{
      return true
    }
  }

  available_item_left_right(row, col){
    console.log("available_item_left_right", col, row)
    const {lastPress} = this.state;
    let item_cur = this.get_item_id(lastPress.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      if(
        item_cur.id !== value.id &&
        (value.col) <= col &&
        (value.col+value.w) > col &&
        (value.row) <= row &&
        (value.row + value.h) > row
      ){
        count+= 1;
      }
    })
    const max_column = this.get_right_column_without_cur(row);
    if(max_column === 0 || count > 0){
      return false
    }else{
      const max_column_average = this.get_right_column_average(row);
      console.log("max_column::::", max_column, max_column_average, col)
      if((max_column +1) !== max_column_average){
        if((max_column+1) < col && col <= max_column_average){
          return false
        }
      }
      return true
    }
  }

  available_item_left(item, width){
    // console.log("available_item_left", item, width)
    const {lastPress} = this.state;
    let item_on = this.get_item_id(item.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      if(
        lastPress.id !== value.id &&
        item.id !== value.id &&
        value.col >= (item_on.col -1) &&
        value.col <= (item_on.col+item_on.w-1) &&
        value.row >= (item_on.row) &&
        value.row <= (item_on.row + (item_on.h-1))
      ){
        count += 1
      }
    })
    if(count > 0){
      return false
    }else{
      return true
    }
  }

  available_item_right(item, width){
    console.log("available_item_right", item, width)
    const {lastPress} = this.state;
    let item_on = this.get_item_id(item.id)
    console.log("item_onlie", item_on)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      if(
        lastPress.id !== value.id &&
        item.id !== value.id &&
        value.col >= (item_on.col) &&
        value.col <= (item_on.col+item_on.w-1 + 1) &&
        value.row >= (item_on.row) &&
        value.row <= (item_on.row + (item_on.h-1))
      ){
        count += 1
      }
    })
    if(count > 0){
      return false
    }else{
      return true
    }
  }

  available_item_bottom(item, width){
    console.log("available_item_bottom", item, width)
    const {lastPress} = this.state;
    let item_on = this.get_item_id(item.id)
    console.log("item_onlie", item_on)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      if(
        lastPress.id !== value.id &&
        item.id !== value.id &&
        value.col >= (item_on.col) &&
        value.col <= (item_on.col+item_on.w-1) &&
        value.row >= (item_on.row) &&
        value.row <= (item_on.row + (item_on.h-1) + 1)
      ){
        count += 1
      }
    })
    if(count > 0){
      return false
    }else{
      return true
    }
  }

  available_item_top(item, width){
    // console.log("available_item_top", item, width)
    const {lastPress} = this.state;
    let item_on = this.get_item_id(item.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      if(
        lastPress.id !== value.id &&
        item.id !== value.id &&
        value.col >= (item_on.col) &&
        value.col <= (item_on.col+item_on.w-1) &&
        value.row >= (item_on.row-1) &&
        value.row <= (item_on.row + (item_on.h-1))
      ){
        count += 1
      }
    })
    if(count > 0){
      return false
    }else{
      return true
    }
  }

  move_item_on_current_row_col(currentRow, currentCol){
    const {lastPress} = this.state;
    this.state.order.forEach((value, key) => {
      if(lastPress.id === value.id){
        value.col = currentCol
        value.row = currentRow
      }
    })
  }

  get_item_left(currentRow, currentCol){
    console.log("get_item_left::", currentRow, currentCol)
    const {lastPress} = this.state;
    let copy = Object.assign({}, this.state);
    let result = []
    copy.order.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.col >= (currentCol) &&
          value.col <= (currentCol+this.state.w-1) &&
          value.row >= currentRow &&
          value.row <= (currentRow + (this.state.h-1))
        ){
          // console.log("Col<<<<<<<", value.id, this.state.w)
          // cp_value.col = cp_value.col + (this.state.w)
          result.push(value)
        }
      }
    })
    return result
  }

  get_item_in(currentRow, currentCol){
    console.log("get_item_in::", currentRow, currentCol)
  }

  get_item_right(currentRow, currentCol){
    console.log("get_item_right::", currentRow, currentCol)
    const {lastPress} = this.state;
    let copy = Object.assign({}, this.state);
    let result = []
    copy.order.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.col >= currentCol &&
          value.col <= currentCol+(this.state.w-1) &&
          value.row >= currentRow &&
          value.row <= (currentRow + (this.state.h-1))
        ){
          console.log("Col>>>>>>>>>", value.id, this.state.w)
          result.push(value)
        }
      }
    })
    return result
  }

  get_item_top(currentRow, currentCol){
    console.log("get_item_top::", currentRow, currentCol)
    const {lastPress} = this.state;
    let copy = Object.assign({}, this.state);
    let result = []
    copy.order.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.row >= (currentRow) &&
          value.row <= (currentRow+this.state.h-1) &&
          value.col >= currentCol &&
          value.col <= (currentCol + (this.state.w-1))
        ){
          // console.log("Row--------", value.id, this.state.h)
          result.push(value)
        }
      }
    })
    return result
  }

  get_item_bottom(currentRow, currentCol){
    console.log("get_item_bottom::", currentRow, currentCol)
    const {lastPress} = this.state;
    let copy = Object.assign({}, this.state);
    let result = []
    copy.order.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.row >= (currentRow) &&
          value.row <= (currentRow+this.state.h-1) &&
          value.col >= currentCol &&
          value.col <= (currentCol + (this.state.w-1))
        ){
          // console.log("Row++++++++++++++", value.id, this.state.h)
          result.push(value)
        }
      }
    })
    return result
  }

  get_last(id){
    const {lastPress} = this.state;
    let copy = Object.assign({}, this.state);
    copy.order.forEach((value, key_y) => {
      if(lastPress.id===value.id){
        let cp_value = Object.assign({}, value);
        this.state.last_col = cp_value.col
        this.state.last_row = cp_value.row
        this.state.w = cp_value.w
        this.state.h = cp_value.h
      }
    })
  }

  get_item_id(id){
    let copy = Object.assign({}, this.state);
    let result = null
    copy.order.forEach((value, key_y) => {
      if(value.id===id){
        // console.log("value", value)
        result = Object.assign({}, value);
      }
    })
    return result

  }

  get_item_between_forward(currentRow, currentCol){
    console.log("get_item_between_forward", currentRow, currentCol)
    let {lastPress} = this.state;
    let lastPress_row, lastPress_col;
    console.log("lastPress", lastPress)
    if(this.state.currentRow && this.state.currentCol){
      lastPress_row = this.state.currentRow
      lastPress_col = this.state.currentCol
    }else{
      lastPress_row = lastPress.row
      lastPress_col = lastPress.col
    }
    // lastPress_row = lastPress.row
    console.log("lastPress_row:",lastPress_row)
    console.log("lastPress_col:",lastPress_col)
    // lastPress = this.get_item_id(lastPress.id)
    let copy = Object.assign({}, this.state);
    let result = []
    copy.order.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.row >= lastPress_row &&
          value.row <= (currentRow)
        ){
          if(currentRow !== lastPress_row){
            if(
              value.col > lastPress_col &&
              value.row === lastPress_row &&
              value.row <= currentRow
            ){
              console.log("between1::>>>>>>>>>>>>", value.id)
              result.push(value)
            }
            if(
              value.row > lastPress_row &&
              value.row < currentRow
            ){
              console.log("between2::>>>>>>>>>>>>", value.id)
              result.push(value)
            }
            if(
              value.col <= currentCol &&
              value.row === currentRow
            ){
              console.log("between3::>>>>>>>>>>>>", value.id)
              result.push(value)
            }
          }else{
            if(
              value.col > lastPress_col &&
              value.col <= currentCol &&
              value.row <= currentRow
            ){
              console.log("between000::>>>>>>>>>>>>", value.id)
              result.push(value)
            }
          }
        }
      }
    })

    return result.sort(this.compare_forward)
  }

  compare_forward(a, b) {
    if(a.row === b.row){
      if(a.col === b.col){
        return 0
      }
      if(a.col > b.col){
        return 1
      }else{
        return -1
      }
    }
    if(a.row > b.row){
      return 1
    }else{
      return -1
    }
  }

  compare_back(a, b) {
    if(a.row === b.row){
      if(a.col === b.col){
        return 0
      }
      if(a.col > b.col){
        return -1
      }else{
        return 1
      }
    }
    if(a.row > b.row){
      return -1
    }else{
      return 1
    }
  }

  get_item_between_back(currentRow, currentCol){
    console.log("get_item_between_back", currentRow, currentCol)
    let {lastPress} = this.state;
    let lastPress_row, lastPress_col;
    console.log("lastPress", lastPress)
    if(this.state.currentRow && this.state.currentCol){
      lastPress_row = this.state.currentRow
      lastPress_col = this.state.currentCol
    }else{
      lastPress_row = lastPress.row
      lastPress_col = lastPress.col
    }
    // console.log("lastPress_row:",lastPress_row)
    // console.log("lastPress_col:",lastPress_col)
    let copy = Object.assign({}, this.state);
    let result = []
    copy.order.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.row <= lastPress_row &&
          value.row >= (currentRow)
        ){
          if(currentRow !== lastPress_row){
            if(
              value.col < lastPress_col &&
              value.row === lastPress_row &&
              value.row >= currentRow
            ){
              // console.log("between1::<<<<<<<<<", value.id)
              result.push(value)
            }
            if(
              value.row < lastPress_row &&
              value.row > currentRow
            ){
              // console.log("between2::<<<<<<<<<", value.id)
              result.push(value)
            }
            if(
              value.col >= currentCol &&
              value.row === currentRow
            ){
              // console.log("between3::<<<<<<<<<", value.id)
              result.push(value)
            }
          }else{
            if(
              value.col < lastPress_col &&
              value.col >= currentCol &&
              value.row >= currentRow
            ){
              // console.log("between000::<<<<<<<<<<", value.id)
              result.push(value)
            }
          }
        }
      }
    })
    return result.sort(this.compare_forward)
  }

  default_Sortable(currentRow, currentCol){
    const {lastPress} = this.state;
    this.get_last(lastPress.id)

    console.log("this.state.currentCol", this.state.currentCol)
    if(this.state.currentCol){
      //col<<<<<<<<<<<<<<<<<<<<<
      if(currentCol < this.state.currentCol){
        console.log("currentCol", currentCol)
        this.get_item_left(currentRow, currentCol).forEach((value, key_y) => {
          if(this.available_item_right(value, this.state.w)){
            this.move_item_right(value, this.state.w)
          }
        })
        if(this.available_item(currentRow, currentCol)){
          this.move_item_on_current_row_col(currentRow, currentCol)
        }
      }
      // col>>>>>>>>>>>>>>>>>>>>>
      if(currentCol >= this.state.currentCol){
        console.log("currentCol", currentCol)
        this.get_item_right(currentRow, currentCol).forEach((value, key_y) => {
          if(this.available_item_left(value, this.state.w)){
            this.move_item_left(value, this.state.w)
          }
        })
        if(this.available_item(currentRow, currentCol)){
          console.log("this.available_item(currentRow, currentCol)", this.available_item(currentRow, currentCol))
          this.move_item_on_current_row_col(currentRow, currentCol)
        }
      }
    }
    if(this.state.currentRow){
      //row---------------------------
      if(currentRow < this.state.currentRow){
        this.get_item_top(currentRow, currentCol).forEach((value, key_y) => {
          if(this.available_item_bottom(value, this.state.w)){
            this.move_item_bottom(value, this.state.w)
          }
        })
        if(this.available_item(currentRow, currentCol)){
          this.move_item_on_current_row_col(currentRow, currentCol)
        }
      }
      //row++++++++++++++++++++++++++++
      if(currentRow > this.state.currentRow){
        this.get_item_bottom(currentRow, currentCol).forEach((value, key_y) => {
          if(this.available_item_top(value, this.state.w)){
            this.move_item_top(value, this.state.w)
          }
        })
        if(this.available_item(currentRow, currentCol)){
          this.move_item_on_current_row_col(currentRow, currentCol)
        }
      }
    }
  }

  left_right_Sortable(currentRow, currentCol){
    const {lastPress} = this.state;
    this.get_last(lastPress.id);
    console.log("mode::left_right_Sortable:::", currentRow, currentCol)

    if(currentCol > this.state.currentCol || currentRow > this.state.currentRow){
      console.log("COl:>>>>>>>>>>>>>>>>", Object.assign({}, this.state.order))
      this.get_item_between_forward(currentRow, currentCol).forEach((value, key_y) => {
        this.move_item_left(value, 1)
      })
      if(this.available_item_left_right(currentRow, currentCol)){
        this.move_item_on_current_row_col(currentRow, currentCol)
      }
    }
    if(currentCol < this.state.currentCol || currentRow < this.state.currentRow){
      console.log("back:<<<<<<<<<<<<<<<", Object.assign({}, this.state.order))
      this.get_item_between_back(currentRow, currentCol).forEach((value, key_y) => {
        this.move_item_right(value, 1)
      })
      if(this.available_item_left_right(currentRow, currentCol)){
        this.move_item_on_current_row_col(currentRow, currentCol)
      }
    }
  }

  handleMouseMove({pageX, pageY}){
    const {isPressed, topDeltaY, topDeltaX} = this.state;

    if (isPressed) {
      let copy = Object.assign({}, this.state);
      const mouseY = pageY - topDeltaY ;
      const currentRow = this.clamp(Math.round(mouseY / (this.state.step_y+this.state.delta)), 1, 10);

      const mouseX = pageX - topDeltaX;
      const currentCol = this.clamp(Math.round(mouseX / (this.state.step_x+this.state.delta)), 1, this.get_right_column_average(currentRow));

      let new_row = []
      new_row = copy.order

      if(this.state.sortable_mode === "default"){
        this.default_Sortable(currentRow, currentCol)
      }
      if(this.state.sortable_mode === "left_right"){
        this.left_right_Sortable(currentRow, currentCol)
      }

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
    this.state.currentCol = null
    this.state.currentRow = null
  }
}

export default Sortable;
