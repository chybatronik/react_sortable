import './utils'

const default_order = [
  {id: 1, w:1, h:1, col:1, row:1, con: "1"},
  {id: 2, w:1, h:1, col:2, row:1, con: "2"},
  {id: 3, w:2, h:2, col:3, row:1, con: "3"},
  // {id: 4, w:2, h:2, col:5, row:1},
  // {id: 5, w:1, h:1, col:6, row:1},

  {id: 11, w:1, h:1, col:1, row:2, con: "11"},
  {id: 12, w:1, h:1, col:2, row:2, con: "12"},
  // {id: 13, w:1, h:1, col:5, row:2},
  // {id: 14, w:1, h:1, col:6, row:2},

  {id: 21, w:1, h:1, col:1, row:3, con: "21"},
  {id: 22, w:1, h:1, col:2, row:3, con: "22"},
  {id: 23, w:1, h:1, col:3, row:3, con: "23"},
  {id: 24, w:1, h:1, col:4, row:3, con: "24"},
  {id: 25, w:1, h:1, col:5, row:3, con: "25"}
]

class Sortable{
  constructor(step_x, step_y, delta, sortable_mode, order, allow_use_empty){
    order = order ? order : default_order
    this.state = {
      sortable_mode: sortable_mode ? sortable_mode: "swipe", // default, left_right
      size_mode: "swipe", // default, stick
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
      old_order: order.clone(),
      init_size: this.get_init_size(order),
      allow_use_empty: allow_use_empty ? allow_use_empty : false
    };
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  add_item_right_col(){
    const col = this.get_right_column_average(1)
    this.state.order.push({id: this.uuidv4(), w:1, h:1, col:col+1, row:1, con: String(this.state.order.length +1)})
    this.state.old_order = this.state.order.clone()
  }

  add_item_end_row(){
    const copy_order = this.state.order;
    let max_row = 0
    copy_order.forEach((value, key) => {
      if(value.row >= max_row){
        max_row = value.row
      }
    })
    this.state.order.push({id: this.uuidv4(), w:1, h:1, col:1, row: max_row + 1, con: String(this.state.order.length +1)})
    this.state.old_order = this.state.order.clone()
  }

  get_init_size(order){
    let result = {}
    const copy_order = Object.assign([], order);
    copy_order.forEach((value, key) => {
      if(value.h > 1 || value.w > 1){
        result[`${value.row}_${value.col}`] = {w: value.w, h: value.h, col: value.col, row: value.row};
      }
    })
    // console.log("get_init_size::", result)
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
            max_column = value.col + (value.w-1)
          }
        }
      }
    })
    // console.log("get_right_column_without_cur::::", max_column)
    return max_column
  }

  get_right_column(row){
    let max_column = 0;
    let copy = Object.assign({}, this.state);
    copy.order.forEach((value, key_y) => {
      if(row === value.row ){
        if((value.col) >= max_column){
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
        if((value.col + value.w-1) >= max_column){
          max_column = value.col + value.w-1
        }
      }
    })
    return max_column
  }

  item_in_init_size_right(item){
    let result = null
    let value;
    Object.keys(this.state.init_size).forEach((str_key, key) => {
      value = this.state.init_size[str_key]
      if(
        item.row > value.row &&
        item.row < (value.row+value.h)
      ){
        if(
          (item.col+1) >= value.col &&
          (item.col+1) < (value.col+value.w)
        ){
          result =  value
        }
      }
    })
    return result
  }

  item_in_init_size_left(item){
    let result = null
    let value;
    Object.keys(this.state.init_size).forEach((str_key, key) => {
      value = this.state.init_size[str_key]
      if(
        item.row > value.row &&
        item.row < (value.row+value.h)
      ){
        if(
          (item.col-1) >= value.col &&
          (item.col-1) < (value.col+value.w)
        ){
          result =  value
        }

      }
    })
    return result
  }

  move_item_right(item, width){
    //console.log("move_item_right", item, ">>>", width)
    let check_ava;
    this.state.order.forEach((value, key) => {
      if(item.id === value.id){
        if(this.state.sortable_mode === "left_right"){
          const max_column = this.get_right_column(value.row)
          // console.log("..........................................")
          // console.log("max_column::::::::::::::::::::", max_column)
          if(max_column === value.col){
            value.col = 1
            value.row += 1
          }else{
            check_ava = this.item_in_init_size_right(value)
            // console.log("==================")
            // console.log("check_ava:::", check_ava)
            if(check_ava){
              value.col += check_ava.w + 1
            }else{
              value.col += width
            }
          }
          // value.w = 1
          // value.h = 1
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
              this.move_item_right(value, 1)
            }
          }
        }else{
          value.col += width
        }
      }
    })
  }

  move_item_left(item, width){
    //console.log("move_item_left", item, ">>>", width)
    let check_ava;
    this.state.order.forEach((value, key) => {
      if(item.id === value.id){
        if(this.state.sortable_mode === "left_right"){
          if(value.col === 1){
            value.row -= 1
            value.col = (this.get_right_column_without_cur(value.row) + 1)
          }else{
            check_ava = this.item_in_init_size_left(value)
            if(check_ava){
              value.col -= check_ava.w + 1
            }else{
              value.col -= width
            }
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
    //console.log("move_item_bottom", item, "-----", width)
    this.state.order.forEach((value, key) => {
      if(item.id === value.id){
        value.row += width
      }
    })
  }

  move_item_top(item, width){
    //console.log("move_item_bottom", item, "-----", width)
    this.state.order.forEach((value, key) => {
      if(item.id === value.id){
        value.row -= width
      }
    })
  }

  available_item_on_old_order(row, col){
    //console.log("------------------")
    //console.log("available_item", col, row,  this.state.old_order, this.state.order)
    // const {lastPress} = this.state;
    // let item_cur = this.get_item_id(lastPress.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.old_order.forEach((value, key_y) => {
      if(
        // item_cur.id !== value.id &&
        (value.col) <= col &&
        (value.col + value.w) > col &&
        (value.row) <= row &&
        (value.row + value.h) > row
      ){
        //console.log("available_item:::value::", value)
        count+= 1;
      }
    })
    //console.log("count::::", count)
    if(count > 0 ){
      return false
    }else{

      return true
    }
  }

  available_item(row, col){
    //console.log("------------------")
    //console.log("available_item", col, row,  this.state.old_order, this.state.order)
    const {lastPress} = this.state;
    let item_cur = this.get_item_id(lastPress.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      if(
        item_cur.id !== value.id &&
        (value.col) <= col &&
        (value.col + value.w) > col &&
        (value.row) <= row &&
        (value.row + value.h) > row
      ){
        //console.log("available_item:::value::", value)
        count+= 1;
      }
    })
    //console.log("count::::", count)
    if(count > 0 ){
      return false
    }else{
      //console.log("available_item_on_old_order:::", this.available_item_on_old_order(row, col), this.state.allow_use_empty)
      if(!this.state.allow_use_empty){
        if(!this.available_item_on_old_order(row, col)){
          return true
        }else{
          return false
        }
      }else{
        return true
      }
    }
  }

  verify_is_owner(row, col){
    const {lastPress} = this.state;
    let res_is_owner = false

    if(
      row >= lastPress.row &&
      row < (lastPress.row + lastPress.h)
    ){
      if(
        col >= lastPress.col &&
        col < (lastPress.col + lastPress.w)
      ){
        res_is_owner = true;
      }
    }
    return res_is_owner
  }

  available_item_left_right(row, col){
    //console.log("available_item_left_right", col, row)
    const {lastPress} = this.state;

    //verify is move to myself
    const res_is_owner = this.verify_is_owner(row, col)
    if(res_is_owner){ return false}

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
      if(max_column === 0){
        //console.log("available_item_left_right:::", this.available_item_on_old_order(row, col), this.state.allow_use_empty)
        if(this.state.allow_use_empty){
          if(this.available_item_on_old_order(row, col)){
            return true
          }else{
            return false
          }
        }
      }
      return false
    }else{
      const max_column_average = this.get_right_column_average(row);
      // console.log("max_column::::", max_column, max_column_average, col)
      if((max_column +1) !== max_column_average){
        if((max_column+1) < col && col <= max_column_average){
          return false
        }
      }
      return true
    }
  }

  available_item_left(item, width){
    //console.log("available_item_left", item, width)
    const {lastPress} = this.state;
    let item_on = this.get_item_id(item.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      Array.from(Array(value.h).keys()).forEach((h, key_h) => {
        //console.log("......", h+1)
        Array.from(Array(value.w).keys()).forEach((w, key_w) => {
          if(
            lastPress.id !== value.id &&
            item.id !== value.id &&
            (value.col + w) >= (item_on.col -1) &&
            (value.col + w) <= (item_on.col+item_on.w-1) &&
            (value.row + h) >= (item_on.row) &&
            (value.row + h) <= (item_on.row + (item_on.h-1))
          ){
            count += 1
          }
        })
      })
    })
    if(count > 0){
      return false
    }else{
      return true
    }
  }

  available_item_right(item, width){
    //console.log("available_item_right", item, width)
    const {lastPress} = this.state;
    let item_on = this.get_item_id(item.id)
    //console.log("item_onlie", item_on)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      Array.from(Array(value.h).keys()).forEach((h, key_h) => {
        //console.log("......", h+1)
        Array.from(Array(value.w).keys()).forEach((w, key_w) => {
          //console.log("......", w+1)
          if(
            lastPress.id !== value.id &&
            item.id !== value.id &&
            (value.col+w) >= (item_on.col) &&
            (value.col+w) <= (item_on.col+item_on.w) &&
            (value.row+h) >= (item_on.row) &&
            (value.row+h) <= (item_on.row + (item_on.h-1))
          ){
            count += 1
          }
        })
      })
    })
    if(count > 0){
      return false
    }else{
      return true
    }
  }

  available_item_bottom(item, width){
    //console.log("available_item_bottom", item, width)
    const {lastPress} = this.state;
    let item_on = this.get_item_id(item.id)
    // console.log("item_onlie", item_on)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      Array.from(Array(value.h).keys()).forEach((h, key_h) => {
        //console.log("......", h+1)
        Array.from(Array(value.w).keys()).forEach((w, key_w) => {
          if(
            lastPress.id !== value.id &&
            item.id !== value.id &&
            (value.col+w) >= (item_on.col) &&
            (value.col+w) <= (item_on.col+item_on.w-1) &&
            (value.row+h) >= (item_on.row) &&
            (value.row+h) <= (item_on.row + (item_on.h-1) + 1)
          ){
            count += 1
          }

        })
      })
    })
    if(count > 0){
      return false
    }else{
      return true
    }
  }

  available_item_top(item, width){
    //console.log("available_item_top", item, width)
    const {lastPress} = this.state;
    let item_on = this.get_item_id(item.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.order.forEach((value, key_y) => {
      Array.from(Array(value.h).keys()).forEach((h, key_h) => {
        //console.log("......", h+1)
        Array.from(Array(value.w).keys()).forEach((w, key_w) => {
          if(
            lastPress.id !== value.id &&
            item.id !== value.id &&
            (value.col + w)>= (item_on.col) &&
            (value.col + w) <= (item_on.col+item_on.w-1) &&
            (value.row + h) >= (item_on.row-1) &&
            (value.row + h) <= (item_on.row + (item_on.h-1))
          ){
            count += 1
          }
        })
      })
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
        if(this.state.sortable_mode === "left_right"){
          value.h = 1
          value.w = 1
          let size;
          if(this.state.init_size[`${value.row}_${value.col}`]){
            size = this.state.init_size[`${value.row}_${value.col}`]
            // is_not_move = true
          }
          if(size){
            value.h = size.h
            value.w = size.w
            value.width = value.w * this.state.step_x + (value.w-1)*this.state.delta
            value.height = value.h * this.state.step_y + (value.h-1)*this.state.delta
          }
        }
      }
    })
  }

  get_item_left(currentRow, currentCol){
    //console.log("get_item_left::", currentRow, currentCol)
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
          result.push(value)
        }
      }
    })
    return result
  }

  get_item_in(currentRow, currentCol){
    //console.log("get_item_in::", currentRow, currentCol)
  }

  get_item_right(currentRow, currentCol){
    //console.log("get_item_right::", currentRow, currentCol)
    const {lastPress} = this.state;
    let copy = Object.assign({}, this.state);
    let result = []
    copy.order.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.col >= currentCol &&
          value.col <= (currentCol+this.state.w-1) &&
          value.row >= currentRow &&
          value.row <= (currentRow + (this.state.h-1))
        ){
          result.push(value)
        }
      }
    })
    return result
  }

  get_item_top(currentRow, currentCol){
    //console.log("get_item_top::", currentRow, currentCol)
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
          result.push(value)
        }
      }
    })
    return result
  }

  get_item_bottom(currentRow, currentCol){
    //console.log("get_item_bottom::", currentRow, currentCol)
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
        result = Object.assign({}, value);
      }
    })
    return result

  }

  get_item_between_forward(currentRow, currentCol){
    // console.log("get_item_between_forward", currentRow, currentCol)
    let {lastPress} = this.state;
    let lastPress_row, lastPress_col;
    // console.log("lastPress", lastPress)
    if(this.state.currentRow && this.state.currentCol){
      lastPress_row = this.state.currentRow
      lastPress_col = this.state.currentCol
    }else{
      lastPress_row = lastPress.row
      lastPress_col = lastPress.col
    }

    //verify is move to myself
    const res_is_owner = this.verify_is_owner(currentRow, currentCol)
    if(
      (!res_is_owner && this.state.res_is_owner) ||
      (!this.state.count_change)
    ){
      lastPress_row = lastPress.row
      lastPress_col = lastPress.col
    }

    let copy = Object.assign({}, this.state);
    let result = []
    if(!res_is_owner){
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
                // console.log("between1::>>>>>>>>>>>>", value.id)
                result.push(value)
              }
              if(
                value.row > lastPress_row &&
                value.row < currentRow
              ){
                // console.log("between2::>>>>>>>>>>>>", value.id)
                result.push(value)
              }
              if(
                value.col <= currentCol &&
                value.row === currentRow
              ){
                // console.log("between3::>>>>>>>>>>>>", value.id)
                result.push(value)
              }
            }else{
              if(
                value.col > lastPress_col &&
                value.col <= currentCol &&
                value.row <= currentRow
              ){
                // console.log("between000::>>>>>>>>>>>>", value.id)
                result.push(value)
              }
            }
          }
        }
      })
    }

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
    //console.log("get_item_between_back", currentRow, currentCol, this.verify_is_owner(currentRow, currentCol), this.state.count_change)
    let {lastPress} = this.state;
    let lastPress_row, lastPress_col;
    // console.log("lastPress", lastPress)
    if(this.state.currentRow && this.state.currentCol){
      lastPress_row = this.state.currentRow
      lastPress_col = this.state.currentCol
    }else{
      lastPress_row = lastPress.row
      lastPress_col = lastPress.col
    }

    const res_is_owner = this.verify_is_owner(currentRow, currentCol)
    if(
      (!res_is_owner && this.state.res_is_owner) ||
      (!this.state.count_change)
    ){
      lastPress_row = lastPress.row
      lastPress_col = lastPress.col
    }
    let result = []
    if(!res_is_owner){
      let copy = Object.assign({}, this.state);
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
                result.push(value)
              }
              if(
                value.row < lastPress_row &&
                value.row > currentRow
              ){
                result.push(value)
              }
              if(
                value.col >= currentCol &&
                value.row === currentRow
              ){
                result.push(value)
              }
            }else{
              if(
                value.col < lastPress_col &&
                value.col >= currentCol &&
                value.row >= currentRow
              ){
                result.push(value)
              }
            }
          }
        }
      })
    }
    return result.sort(this.compare_forward)
  }

  default_Sortable(currentRow, currentCol){
    const {lastPress} = this.state;
    this.get_last(lastPress.id)

    //console.log("this.state.currentCol", this.state.currentCol)
    if(this.state.currentCol){
      //col<<<<<<<<<<<<<<<<<<<<<
      if(currentCol < this.state.currentCol){
        //console.log("currentCol", currentCol)
        this.get_item_left(currentRow, currentCol).forEach((value, key_y) => {

          if(this.available_item_right(value, this.state.w)){
            //console.log("move right:::", value)
            this.move_item_right(value, this.state.w)
          }
        })
        //console.log("this.available_item(currentRow, currentCol)", this.available_item(currentRow, currentCol))
        if(this.available_item(currentRow, currentCol)){
          this.move_item_on_current_row_col(currentRow, currentCol)
        }
      }
      // col>>>>>>>>>>>>>>>>>>>>>
      if(currentCol > this.state.currentCol){
        //console.log("currentCol", currentCol)
        this.get_item_right(currentRow, currentCol).forEach((value, key_y) => {
          if(this.available_item_left(value, this.state.w)){
            this.move_item_left(value, this.state.w)
          }
        })
        //console.log("this.available_item(currentRow, currentCol)", this.available_item(currentRow, currentCol))
        if(this.available_item(currentRow, currentCol)){
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
        //console.log("this.available_item(currentRow, currentCol)", this.available_item(currentRow, currentCol))
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
        //console.log("this.available_item(currentRow, currentCol)", this.available_item(currentRow, currentCol))
        if(this.available_item(currentRow, currentCol)){
          this.move_item_on_current_row_col(currentRow, currentCol)
        }
      }
    }
  }

  left_right_Sortable(currentRow, currentCol){
    const {lastPress} = this.state;
    let count_change = 0;
    this.get_last(lastPress.id);
    //console.log("mode::left_right_Sortable:::", currentRow, currentCol)

    if(currentCol > this.state.currentCol || currentRow > this.state.currentRow){
      // console.log("COl:>>>>>>>>>>>>>>>>", Object.assign({}, this.state.order))
      // console.log("available::", this.available_item_left_right(currentRow, currentCol))
      let value_to_left = []
      if(!this.available_item_on_old_order(currentRow, currentCol)){
        this.get_item_between_forward(currentRow, currentCol).forEach((value, key_y) => {
          //console.log("value::", value)
          this.move_item_left(value, 1)
          count_change += 1
          value_to_left.push(value)
        })
      }
      if(this.available_item_left_right(currentRow, currentCol)){
        this.move_item_on_current_row_col(currentRow, currentCol)
        count_change += 1
      }else{
        value_to_left.forEach((value, key_y) => {
          // console.log("value::", value)
          this.move_item_right(value, 1)
          count_change -= 1
          // value_to_left.push(value)
        })
      }
    }
    if(currentCol < this.state.currentCol || currentRow < this.state.currentRow){
      //console.log("back:<<<<<<<<<<<<<<<", Object.assign({}, this.state.order))
      //console.log("available::", this.available_item_left_right(currentRow, currentCol))
      let value_to_right = []
      if(!this.available_item_on_old_order(currentRow, currentCol)){
        this.get_item_between_back(currentRow, currentCol).forEach((value, key_y) => {
          //console.log("value::", value)
          this.move_item_right(value, 1)
          count_change += 1
          value_to_right.push(value)
        })
      }
      if(this.available_item_left_right(currentRow, currentCol)){
        this.move_item_on_current_row_col(currentRow, currentCol)
        count_change += 1
      }else{
        value_to_right.forEach((value, key_y) => {
          // console.log("value::", value)
          this.move_item_left(value, 1)
          count_change -= 1
          // value_to_left.push(value)
        })
      }
    }
    return count_change
  }

  handleMouseMove({pageX, pageY}){
    const {isPressed, topDeltaY, topDeltaX} = this.state;

    if (isPressed) {
      let copy = Object.assign({}, this.state);
      const mouseY = pageY - topDeltaY ;
      const currentRow = this.clamp(Math.round(mouseY / (this.state.step_y+this.state.delta)), 1, 10);

      const mouseX = pageX - topDeltaX;
      const currentCol = this.clamp(Math.round(mouseX / (this.state.step_x+this.state.delta)), 1, this.get_right_column_average(currentRow));

      //console.log("currentRow::", currentRow)
      //console.log("currentCol::", currentCol)

      let new_row = []
      new_row = copy.order

      if(this.state.sortable_mode === "swipe"){
        this.state.count_change = this.default_Sortable(currentRow, currentCol)
      }
      if(this.state.sortable_mode === "left_right"){
        this.state.count_change = this.left_right_Sortable(currentRow, currentCol)
      }

      if(currentRow !== this.state.currentRow){
        this.state.currentRow = currentRow
        this.state.res_is_owner = this.verify_is_owner(currentRow, currentCol)
      }
      if(currentCol !== this.state.currentCol){
        this.state.currentCol = currentCol
        this.state.res_is_owner = this.verify_is_owner(currentRow, currentCol)
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
    // let copy = Object.assign({}, this.state);
    // this.state.old_order = copy.order;
    // console.log("this.state.old_order:::", this.state.old_order)
    this.state.old_order = this.state.order.clone()
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
