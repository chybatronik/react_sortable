
class Sortable{
  constructor(config){
    // console.log("sortable new")
    const cells = config.cells ? config.cells : [] //default_order
    this.state = {
      mode: config.mode ? config.mode: "SORT", // default, SORT
      // size_mode: "SWAP", // default, stick
      cellSpacing: config.cellSpacing ? config.cellSpacing: 5,
      cellWidth: config.cellWidth ? config.cellWidth: 90,
      cellHeight: config.cellHeight ? config.cellHeight: 90,
      mouseX: 0,
      mouseY: 0,
      // lastPress: -1,
      isPressed: false,
      // currentRow:-1,
      // currentCol:-1,
      cells: this.clone(cells),
      old_order: this.clone(cells),
      init_size: this.get_init_size(cells),

      isDropOnEmptyAreaAllowed: config.isDropOnEmptyAreaAllowed ? config.isDropOnEmptyAreaAllowed : false,

      handleTouchMove: config.handleTouchMove,
      handleMouseUp: config.handleMouseUp,
      handleMouseMove: config.handleMouseMove,
      handleMouseDown: config.handleMouseDown,

      onCellDragStart: config.onCellDragStart,
      onCellDrop: config.onCellDrop,
      isGridLocked: config.isGridLocked ? config.isGridLocked : false

    };
    // console.log("window:::", window)
    window.addEventListener('touchmove', this.onHandleTouchMove);
    window.addEventListener('touchend', this.onHandleMouseUp);
    window.addEventListener('mousemove', this.onHandleMouseMove);
    window.addEventListener('mouseup', this.onHandleMouseUp);

  }

  clone(obj){
    //// eslint-disable-next-line
    var newObj = (obj instanceof Array) ? [] : {};
    var i;
    for (i in obj) {
        if (i === 'clone')
            continue;
        if (obj[i] && typeof obj[i] === "object") {
            newObj[i] = this.clone(obj[i]);
        }
        else
            newObj[i] = obj[i]
    } return newObj;
  };


  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  add_item_right_col(){
    const defaultColumn = this.get_right_column_average(1)
    this.state.cells.push({id: this.uuidv4(), colspan:1, rowspan:1, defaultColumn:defaultColumn+1, defaultRow:1, content: String(this.state.cells.length +1)})
    this.state.old_order = this.clone(this.state.cells)
  }

  add_item_end_row(){
    const copy_order = this.state.cells;
    let max_row = 0
    copy_order.forEach((value, key) => {
      if(value.defaultRow >= max_row){
        max_row = value.defaultRow
      }
    })
    this.state.cells.push({id: this.uuidv4(), colspan:1, rowspan:1, defaultColumn:1, defaultRow: max_row + 1, content: String(this.state.cells.length +1)})
    this.state.old_order = this.clone(this.state.cells)
  }

  get_init_size(cells){
    let result = {}
    const copy_order = Object.assign([], cells);
    copy_order.forEach((value, key) => {
      if(value.rowspan > 1 || value.colspan > 1){
        result[`${value.defaultRow}_${value.defaultColumn}`] = {colspan: value.colspan, rowspan: value.rowspan, defaultColumn: value.defaultColumn, defaultRow: value.defaultRow};
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
    copy.cells.forEach((value, key) => {
      let ttm = value
      ttm.width = ttm.colspan * copy.cellWidth + (ttm.colspan-1)*copy.cellSpacing
      ttm.height = ttm.rowspan * copy.cellHeight + (ttm.rowspan-1)*copy.cellSpacing
      ttm.y = ttm.defaultRow * (copy.cellHeight + copy.cellSpacing)
      ttm.x = ttm.defaultColumn * (copy.cellWidth + copy.cellSpacing)
      res_order.push(ttm)
    })
    copy.cells = res_order
    return copy
  }

  get_left_column_without_cur(defaultRow){
    // console.log("row_______:::", defaultRow)
    let max_column = 0;
    // const {lastPress} = this.state;
    // let copy = Object.assign({}, this.state);
    // copy.cells.forEach((value, key_y) => {
    //   //|| defaultRow === (value.defaultRow + value.rowspan - 1)
    //   if(defaultRow === value.defaultRow){
    //     if(value.defaultColumn >= max_column){
    //       if(lastPress.id !== value.id){
    //         console.log("get_right_column_without_cur:::", value)
    //         max_column = value.defaultColumn + (value.colspan-1)
    //       }
    //     }
    //   }
    // })
    // max_column = this.get_right_column_average(defaultRow)
    // console.log("max_right_col", max_right_col)
    let min_col = 0
    Object.keys(this.state.init_size).forEach((str_key, key) => {
      let value = this.state.init_size[str_key]
      if(
        defaultRow > value.defaultRow &&
        defaultRow < (value.defaultRow+value.rowspan)
      ){
        if(min_col > value.defaultColumn){
          min_col = value.defaultColumn
        }
        // console.log("max_right_col::", max_right_col)
        // console.log("(value.defaultColumn+value.colspan)::", (value.defaultColumn+value.colspan))
        if(
          max_column < (value.defaultColumn+value.colspan) &&
          value.defaultColumn === 1
          // (value.defaultColumn+value.colspan) <= max_right_col
        ){
          max_column =  value.defaultColumn+value.colspan - 1
        }
      }
    })
    if(min_col > 1){
      return 0
    }else{
      return max_column
    }
    // console.log("get_right_column_without_cur::@@@@@::", max_column)

  }

  get_right_column_without_cur(defaultRow){
    // console.log("row_______:::", defaultRow)
    let max_column = 0;
    const {lastPress} = this.state;
    let copy = Object.assign({}, this.state);
    copy.cells.forEach((value, key_y) => {
      //|| defaultRow === (value.defaultRow + value.rowspan - 1)
      if(defaultRow === value.defaultRow){
        if(value.defaultColumn >= max_column){
          if(lastPress.id !== value.id){
            // console.log("get_right_column_without_cur:::", value)
            max_column = value.defaultColumn + (value.colspan-1)
          }
        }
      }
    })
    let max_right_col = this.get_right_column_average(defaultRow)
    // console.log("max_right_col", max_right_col)
    Object.keys(this.state.init_size).forEach((str_key, key) => {
      let value = this.state.init_size[str_key]
      if(
        defaultRow > value.defaultRow &&
        defaultRow < (value.defaultRow+value.rowspan)
      ){
        // console.log("max_right_col::", max_right_col)
        // console.log("(value.defaultColumn+value.colspan)::", (value.defaultColumn+value.colspan))
        if(
          max_column < (value.defaultColumn+value.colspan) &&
          (value.defaultColumn+value.colspan) <= max_right_col
        ){
          max_column =  (value.defaultColumn+value.colspan-1)
        }
      }
    })
    // console.log("get_right_column_without_cur::@@@@@::", max_column)
    return max_column
  }

  get_right_column(defaultRow){
    let max_column = 0;
    let copy = Object.assign({}, this.state);
    copy.cells.forEach((value, key_y) => {
      if(defaultRow === value.defaultRow ){
        if((value.defaultColumn) >= max_column){
          max_column = value.defaultColumn
        }
      }
    })
    return max_column
  }

  get_right_column_average(defaultRow){
    let max_column = 0;
    let copy = Object.assign({}, this.state);
    copy.old_order.forEach((value, key_y) => {
      if(defaultRow >= value.defaultRow ){
        if((value.defaultColumn + value.colspan-1) >= max_column){
          max_column = value.defaultColumn + value.colspan-1
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
        item.defaultRow > value.defaultRow &&
        item.defaultRow < (value.defaultRow+value.rowspan)
      ){
        if(
          (item.defaultColumn+1) >= value.defaultColumn &&
          (item.defaultColumn+1) < (value.defaultColumn+value.colspan)
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
        item.defaultRow > value.defaultRow &&
        item.defaultRow < (value.defaultRow+value.rowspan)
      ){
        if(
          (item.defaultColumn-1) >= value.defaultColumn &&
          (item.defaultColumn-1) < (value.defaultColumn+value.colspan)
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
    this.state.cells.forEach((value, key) => {
      if(item.id === value.id){
        if(this.state.mode === "SORT"){
          const max_column = this.get_right_column(value.defaultRow)
          // console.log("..........................................")
          // console.log("max_column::::::::::::::::::::", max_column)
          if(max_column === value.defaultColumn){
            // console.log("this.get_left_column_without_cur(value.defaultRow)!!!", value.defaultRow, " ! ", this.get_left_column_without_cur(value.defaultRow+1))

            // value.defaultColumn = 1
            value.defaultColumn = this.get_left_column_without_cur(value.defaultRow+1)+1
            value.defaultRow += 1
          }else{
            check_ava = this.item_in_init_size_right(value)
            // console.log("==================")
            // console.log("check_ava:::", check_ava)
            if(check_ava){
              value.defaultColumn += check_ava.colspan + 1
            }else{
              value.defaultColumn += width
            }
          }
          // value.colspan = 1
          // value.rowspan = 1
          value.colspan = 1
          value.rowspan = 1
          let size, is_not_move;
          if(this.state.init_size[`${value.defaultRow}_${value.defaultColumn-1}`]){
            size = this.state.init_size[`${value.defaultRow}_${value.defaultColumn-1}`]
            is_not_move = false
          }
          if(this.state.init_size[`${value.defaultRow}_${value.defaultColumn}`]){
            size = this.state.init_size[`${value.defaultRow}_${value.defaultColumn}`]
            is_not_move = true
          }
          if(size){
            value.rowspan = size.rowspan
            value.colspan = size.colspan
            value.width = value.colspan * this.state.cellWidth + (value.colspan-1)*this.state.cellSpacing
            value.height = value.rowspan * this.state.cellHeight + (value.rowspan-1)*this.state.cellSpacing
            if(!is_not_move){
              this.move_item_right(value, 1)
            }
          }
        }else{
          value.defaultColumn += width
        }
      }
    })
  }

  is_left_nothing(defaultRow, search_col){
    let res = false
    // console.log("this.state.init_size::", this.state.init_size, defaultRow, search_col)
    Object.keys(this.state.init_size).forEach((value, key) => {
      // console.log("value:", value)
      // console.log("key:", key)
      let res_is_owner = false
      const lastPress = this.state.init_size[value]
      if(
        defaultRow >= lastPress.defaultRow &&
        defaultRow < (lastPress.defaultRow + lastPress.rowspan)
      ){
        if(
          search_col >= lastPress.defaultColumn &&
          search_col < (lastPress.defaultColumn + lastPress.colspan + 1)
        ){
          res_is_owner = true;
        }
      }
      if(res_is_owner && (defaultRow !== lastPress.defaultRow && search_col !== lastPress.defaultColumn)){
        // console.log("res_is_owner:", res_is_owner, search_col, lastPress, (search_col - lastPress.colspan ))
        if((search_col - lastPress.colspan)===1){
          res =  true
        }
      }
    })
    if((res || (search_col ===1))){
      return true
    }else {
      return false
    }
  }

  move_item_left(item, width){
    // console.log("move_item_left::", item.defaultColumn, "__", item.defaultRow, ">>>", width)
    let check_ava;
    this.state.cells.forEach((value, key) => {
      if(item.id === value.id){
        if(this.state.mode === "SORT"){
          // console.log("is_left_nothing::::", this.is_left_nothing(value.defaultRow, value.defaultColumn))
          // if(value.defaultColumn === 1){
          if(this.is_left_nothing(value.defaultRow, value.defaultColumn)){
            // console.log("this.get_right_column_without_cur(value.defaultRow)!!!", value.defaultRow, " ! ", this.get_right_column_without_cur(value.defaultRow-1))
            value.defaultColumn = (this.get_right_column_without_cur(value.defaultRow-1)+1)
            value.defaultRow -= 1
            // value.defaultColumn = (this.get_right_column_without_cur(value.defaultRow)+1)
          }else{
            check_ava = this.item_in_init_size_left(value)
            // console.log("check_ava::", check_ava)
            if(check_ava){
              value.defaultColumn -= check_ava.colspan + 1
            }else{
              value.defaultColumn -= width
            }
          }
          value.colspan = 1
          value.rowspan = 1
          let size, is_not_move;
          if(this.state.init_size[`${value.defaultRow}_${value.defaultColumn-1}`]){
            size = this.state.init_size[`${value.defaultRow}_${value.defaultColumn-1}`]
            is_not_move = false
          }
          if(this.state.init_size[`${value.defaultRow}_${value.defaultColumn}`]){
            size = this.state.init_size[`${value.defaultRow}_${value.defaultColumn}`]
            is_not_move = true
          }

          if(size){
            value.rowspan = size.rowspan
            value.colspan = size.colspan
            value.width = value.colspan * this.state.cellWidth + (value.colspan-1)*this.state.cellSpacing
            value.height = value.rowspan * this.state.cellHeight + (value.rowspan-1)*this.state.cellSpacing
            if(!is_not_move){
              // console.log("move_item_left............")
              this.move_item_left(value, 1)
            }
          }
        }
        else{
          value.defaultColumn -= width
        }
      }
    })
  }

  move_item_bottom(item, width){
    //console.log("move_item_bottom", item, "-----", width)
    this.state.cells.forEach((value, key) => {
      if(item.id === value.id){
        value.defaultRow += width
      }
    })
  }

  move_item_top(item, width){
    //console.log("move_item_bottom", item, "-----", width)
    this.state.cells.forEach((value, key) => {
      if(item.id === value.id){
        value.defaultRow -= width
      }
    })
  }

  available_item_on_old_order(defaultRow, defaultColumn){
    //console.log("------------------")
    // console.log("available_item", defaultColumn, defaultRow,  this.state.old_order, this.state.cells)
    // const {lastPress} = this.state;
    // let item_cur = this.get_item_id(lastPress.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.old_order.forEach((value, key_y) => {
      if(
        // item_cur.id !== value.id &&
        (value.defaultColumn) <= defaultColumn &&
        (value.defaultColumn + value.colspan) > defaultColumn &&
        (value.defaultRow) <= defaultRow &&
        (value.defaultRow + value.rowspan) > defaultRow
      ){
        // console.log("available_item:::value::", value)
        count+= 1;
      }
    })

    if(count > 0 ){
      return false
    }else{

      return true
    }
  }

  available_item(defaultRow, defaultColumn){
    // console.log("------------÷------")
    // console.log("available_item", defaultColumn, defaultRow,  this.state.old_order, this.state.cells)
    const {lastPress} = this.state;
    let item_cur = this.get_item_id(lastPress.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.cells.forEach((value, key_y) => {
      if(
        item_cur.id !== value.id &&
        (value.defaultColumn) <= defaultColumn &&
        (value.defaultColumn + value.colspan) > defaultColumn &&
        (value.defaultRow) <= defaultRow &&
        (value.defaultRow + value.rowspan) > defaultRow
      ){
        //console.log("available_item:::value::", value)
        count+= 1;
      }
    })
    // console.log("count::::", count)
    if(count > 0 ){
      return false
    }else{
      if(!this.state.isDropOnEmptyAreaAllowed){
        // console.log("available_item_on_old_order:::", this.available_item_on_old_order(defaultRow, defaultColumn), this.state.isDropOnEmptyAreaAllowed)

        if(!this.available_item_on_old_order(defaultRow, defaultColumn)){
          // console.log("return true")
          const max_right_col = this.get_right_column_average(defaultRow)
          if((defaultColumn + item_cur.colspan-1) <= max_right_col){
            return true
          }else{
            return false
          }
          // if(this.cur_item_myself(defaultRow, defaultColumn)){
          //   return false
          // }else{
          //   return true
          // }
          // return true
        }else{
          return false
        }
      }else{
        return true
      }
    }
  }

  verify_is_owner(defaultRow, defaultColumn){
    const {lastPress} = this.state;
    let res_is_owner = false

    if(
      defaultRow >= lastPress.defaultRow &&
      defaultRow < (lastPress.defaultRow + lastPress.rowspan)
    ){
      if(
        defaultColumn >= lastPress.defaultColumn &&
        defaultColumn < (lastPress.defaultColumn + lastPress.colspan)
      ){
        res_is_owner = true;
      }
    }
    return res_is_owner
  }

  available_item_left_right(defaultRow, defaultColumn){
    //console.log("available_item_left_right", defaultColumn, defaultRow)
    const {lastPress} = this.state;

    //verify is move to myself
    const res_is_owner = this.verify_is_owner(defaultRow, defaultColumn)
    if(res_is_owner){ return false}

    let item_cur = this.get_item_id(lastPress.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.cells.forEach((value, key_y) => {
      if(
        item_cur.id !== value.id &&
        (value.defaultColumn) <= defaultColumn &&
        (value.defaultColumn+value.colspan) > defaultColumn &&
        (value.defaultRow) <= defaultRow &&
        (value.defaultRow + value.rowspan) > defaultRow
      ){
        count+= 1;
      }
    })

    const max_column = this.get_right_column_without_cur(defaultRow);
    if(max_column === 0 || count > 0){
      if(max_column === 0){
        //console.log("available_item_left_right:::", this.available_item_on_old_order(defaultRow, defaultColumn), this.state.isDropOnEmptyAreaAllowed)
        if(this.state.isDropOnEmptyAreaAllowed){
          if(this.available_item_on_old_order(defaultRow, defaultColumn)){
            return true
          }else{
            return false
          }
        }
      }
      return false
    }else{
      const max_column_average = this.get_right_column_average(defaultRow);
      // console.log("max_column::::", max_column, max_column_average, defaultColumn)
      if((max_column +1) !== max_column_average){
        if((max_column+1) < defaultColumn && defaultColumn <= max_column_average){
          return false
        }
      }
      return true
    }
  }

  when_available_item_left_right(defaultRow, defaultColumn){
    //console.log("available_item_left_right", defaultColumn, defaultRow)
    const {lastPress} = this.state;

    //verify is move to myself
    const res_is_owner = this.verify_is_owner(defaultRow, defaultColumn)
    if(res_is_owner){ return false}

    let item_cur = this.get_item_id(lastPress.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    let search_value = null;
    copy.cells.forEach((value, key_y) => {
      if(
        item_cur.id !== value.id &&
        (value.defaultColumn) <= defaultColumn &&
        (value.defaultColumn+value.colspan) > defaultColumn &&
        (value.defaultRow) <= defaultRow &&
        (value.defaultRow + value.rowspan) > defaultRow
      ){
        count+= 1;
        // console.log("value::value::", value)
        search_value = value
      }
    })
    if(count === 1){
      return search_value
    }else{
      return null
    }

  }

  available_item_left(item, width){
    //console.log("available_item_left", item, width)
    const {lastPress} = this.state;
    let item_on = this.get_item_id(item.id)
    let copy = Object.assign({}, this.state);
    let count = 0;
    copy.cells.forEach((value, key_y) => {
      Array.from(Array(value.rowspan).keys()).forEach((rowspan, key_h) => {
        //console.log("......", rowspan+1)
        Array.from(Array(value.colspan).keys()).forEach((colspan, key_w) => {
          if(
            lastPress.id !== value.id &&
            item.id !== value.id &&
            (value.defaultColumn + colspan) >= (item_on.defaultColumn -1) &&
            (value.defaultColumn + colspan) <= (item_on.defaultColumn+item_on.colspan-1) &&
            (value.defaultRow + rowspan) >= (item_on.defaultRow) &&
            (value.defaultRow + rowspan) <= (item_on.defaultRow + (item_on.rowspan-1))
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
    copy.cells.forEach((value, key_y) => {
      Array.from(Array(value.rowspan).keys()).forEach((rowspan, key_h) => {
        //console.log("......", rowspan+1)
        Array.from(Array(value.colspan).keys()).forEach((colspan, key_w) => {
          //console.log("......", colspan+1)
          if(
            lastPress.id !== value.id &&
            item.id !== value.id &&
            (value.defaultColumn+colspan) >= (item_on.defaultColumn) &&
            (value.defaultColumn+colspan) <= (item_on.defaultColumn+item_on.colspan) &&
            (value.defaultRow+rowspan) >= (item_on.defaultRow) &&
            (value.defaultRow+rowspan) <= (item_on.defaultRow + (item_on.rowspan-1))
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
    copy.cells.forEach((value, key_y) => {
      Array.from(Array(value.rowspan).keys()).forEach((rowspan, key_h) => {
        //console.log("......", rowspan+1)
        Array.from(Array(value.colspan).keys()).forEach((colspan, key_w) => {
          if(
            lastPress.id !== value.id &&
            item.id !== value.id &&
            (value.defaultColumn+colspan) >= (item_on.defaultColumn) &&
            (value.defaultColumn+colspan) <= (item_on.defaultColumn+item_on.colspan-1) &&
            (value.defaultRow+rowspan) >= (item_on.defaultRow) &&
            (value.defaultRow+rowspan) <= (item_on.defaultRow + (item_on.rowspan-1) + 1)
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
    copy.cells.forEach((value, key_y) => {
      Array.from(Array(value.rowspan).keys()).forEach((rowspan, key_h) => {
        //console.log("......", rowspan+1)
        Array.from(Array(value.colspan).keys()).forEach((colspan, key_w) => {
          if(
            lastPress.id !== value.id &&
            item.id !== value.id &&
            (value.defaultColumn + colspan)>= (item_on.defaultColumn) &&
            (value.defaultColumn + colspan) <= (item_on.defaultColumn+item_on.colspan-1) &&
            (value.defaultRow + rowspan) >= (item_on.defaultRow-1) &&
            (value.defaultRow + rowspan) <= (item_on.defaultRow + (item_on.rowspan-1))
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
    this.state.cells.forEach((value, key) => {
      if(lastPress.id === value.id){

        value.defaultColumn = currentCol
        value.defaultRow = currentRow
        if(this.state.mode === "SORT"){
          value.rowspan = 1
          value.colspan = 1
          let size;
          if(this.state.init_size[`${value.defaultRow}_${value.defaultColumn}`]){
            size = this.state.init_size[`${value.defaultRow}_${value.defaultColumn}`]
            // is_not_move = true
          }
          if(size){
            value.rowspan = size.rowspan
            value.colspan = size.colspan
            value.width = value.colspan * this.state.cellWidth + (value.colspan-1)*this.state.cellSpacing
            value.height = value.rowspan * this.state.cellHeight + (value.rowspan-1)*this.state.cellSpacing
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
    copy.cells.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.defaultColumn >= (currentCol) &&
          value.defaultColumn <= (currentCol+this.state.colspan-1) &&
          value.defaultRow >= currentRow &&
          value.defaultRow <= (currentRow + (this.state.rowspan-1))
        ){
          result.push(value)
        }
      }
    })
    return result
  }

  get_item_right(currentRow, currentCol){
    //console.log("get_item_right::", currentRow, currentCol)
    const {lastPress} = this.state;
    let copy = Object.assign({}, this.state);
    let result = []
    copy.cells.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.defaultColumn >= currentCol &&
          value.defaultColumn <= (currentCol+this.state.colspan-1) &&
          value.defaultRow >= currentRow &&
          value.defaultRow <= (currentRow + (this.state.rowspan-1))
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
    copy.cells.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.defaultRow >= (currentRow) &&
          value.defaultRow <= (currentRow+this.state.rowspan-1) &&
          value.defaultColumn >= currentCol &&
          value.defaultColumn <= (currentCol + (this.state.colspan-1))
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
    copy.cells.forEach((value, key_y) => {
      if(lastPress.id!==value.id){
        if(
          value.defaultRow >= (currentRow) &&
          value.defaultRow <= (currentRow+this.state.rowspan-1) &&
          value.defaultColumn >= currentCol &&
          value.defaultColumn <= (currentCol + (this.state.colspan-1))
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
    copy.cells.forEach((value, key_y) => {
      if(lastPress.id===value.id){
        let cp_value = Object.assign({}, value);
        this.state.last_col = cp_value.defaultColumn
        this.state.last_row = cp_value.defaultRow
        this.state.colspan = cp_value.colspan
        this.state.rowspan = cp_value.rowspan
      }
    })
  }

  get_item_id(id){
    let copy = Object.assign({}, this.state);
    let result = null
    copy.cells.forEach((value, key_y) => {
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
      lastPress_row = lastPress.defaultRow
      lastPress_col = lastPress.defaultColumn
    }

    //verify is move to myself
    const res_is_owner = this.verify_is_owner(currentRow, currentCol)
    if(
      (!res_is_owner && this.state.res_is_owner) ||
      (!this.state.count_change)
    ){
      lastPress_row = lastPress.defaultRow
      lastPress_col = lastPress.defaultColumn
    }

    let copy = Object.assign({}, this.state);
    let result = []
    if(!res_is_owner){
      copy.cells.forEach((value, key_y) => {
        if(lastPress.id!==value.id){
          if(
            value.defaultRow >= lastPress_row &&
            value.defaultRow <= (currentRow)
          ){
            if(currentRow !== lastPress_row){
              if(
                value.defaultColumn > lastPress_col &&
                value.defaultRow === lastPress_row &&
                value.defaultRow <= currentRow
              ){
                // console.log("between1::>>>>>>>>>>>>", value.id)
                result.push(value)
              }
              if(
                value.defaultRow > lastPress_row &&
                value.defaultRow < currentRow
              ){
                // console.log("between2::>>>>>>>>>>>>", value.id)
                result.push(value)
              }
              if(
                value.defaultColumn <= currentCol &&
                value.defaultRow === currentRow
              ){
                // console.log("between3::>>>>>>>>>>>>", value.id)
                result.push(value)
              }
            }else{
              if(
                value.defaultColumn > lastPress_col &&
                value.defaultColumn <= currentCol &&
                value.defaultRow <= currentRow
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
    if(a.defaultRow === b.defaultRow){
      if(a.defaultColumn === b.defaultColumn){
        return 0
      }
      if(a.defaultColumn > b.defaultColumn){
        return 1
      }else{
        return -1
      }
    }
    if(a.defaultRow > b.defaultRow){
      return 1
    }else{
      return -1
    }
  }

  compare_back(a, b) {
    if(a.defaultRow === b.defaultRow){
      if(a.defaultColumn === b.defaultColumn){
        return 0
      }
      if(a.defaultColumn > b.defaultColumn){
        return -1
      }else{
        return 1
      }
    }
    if(a.defaultRow > b.defaultRow){
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
      lastPress_row = lastPress.defaultRow
      lastPress_col = lastPress.defaultColumn
    }

    const res_is_owner = this.verify_is_owner(currentRow, currentCol)
    if(
      (!res_is_owner && this.state.res_is_owner) ||
      (!this.state.count_change)
    ){
      lastPress_row = lastPress.defaultRow
      lastPress_col = lastPress.defaultColumn
    }
    let result = []
    if(!res_is_owner){
      let copy = Object.assign({}, this.state);
      copy.cells.forEach((value, key_y) => {
        if(lastPress.id!==value.id){
          if(
            value.defaultRow <= lastPress_row &&
            value.defaultRow >= (currentRow)
          ){
            if(currentRow !== lastPress_row){
              if(
                value.defaultColumn < lastPress_col &&
                value.defaultRow === lastPress_row &&
                value.defaultRow >= currentRow
              ){
                result.push(value)
              }
              if(
                value.defaultRow < lastPress_row &&
                value.defaultRow > currentRow
              ){
                result.push(value)
              }
              if(
                value.defaultColumn >= currentCol &&
                value.defaultRow === currentRow
              ){
                result.push(value)
              }
            }else{
              if(
                value.defaultColumn < lastPress_col &&
                value.defaultColumn >= currentCol &&
                value.defaultRow >= currentRow
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

    // console.log("this.state.currentCol", this.state.currentCol)
    if(this.state.currentCol){
      // defaultColumn<<<<<<<<<<<<<<<<<<<<<
      if(currentCol < this.state.currentCol){
        //console.log("currentCol", currentCol)
        this.get_item_left(currentRow, currentCol).forEach((value, key_y) => {

          if(this.available_item_right(value, this.state.colspan)){
            //console.log("move right:::", value)
            this.move_item_right(value, this.state.colspan)
          }
        })
        // console.log("this.available_item(currentRow, currentCol)", this.available_item(currentRow, currentCol))
        if(this.available_item(currentRow, currentCol)){
          this.move_item_on_current_row_col(currentRow, currentCol)
        }
      }
      // defaultColumn>>>>>>>>>>>>>>>>>>>>>
      if(currentCol > this.state.currentCol){
        //console.log("currentCol", currentCol)
        this.get_item_right(currentRow, currentCol).forEach((value, key_y) => {
          if(this.available_item_left(value, this.state.colspan)){
            this.move_item_left(value, this.state.colspan)
          }
        })
        // console.log("_______________")
        // console.log("this.available_item(currentRow, currentCol)", this.available_item(currentRow, currentCol))
        if(this.available_item(currentRow, currentCol)){
          this.move_item_on_current_row_col(currentRow, currentCol)
        }
      }
    }
    if(this.state.currentRow){
      //defaultRow---------------------------
      if(currentRow < this.state.currentRow){
        this.get_item_top(currentRow, currentCol).forEach((value, key_y) => {
          if(this.available_item_bottom(value, this.state.colspan)){
            this.move_item_bottom(value, this.state.colspan)
          }
        })
        // console.log("this.available_item(currentRow, currentCol)", this.available_item(currentRow, currentCol))
        if(this.available_item(currentRow, currentCol)){
          this.move_item_on_current_row_col(currentRow, currentCol)
        }
      }
      //defaultRow++++++++++++++++++++++++++++
      if(currentRow > this.state.currentRow){
        this.get_item_bottom(currentRow, currentCol).forEach((value, key_y) => {
          if(this.available_item_top(value, this.state.colspan)){
            this.move_item_top(value, this.state.colspan)
          }
        })
        // console.log("this.available_item(currentRow, currentCol)", this.available_item(currentRow, currentCol))
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
    // console.log("mode::left_right_Sortable:::", currentRow, currentCol)

    if(currentCol > this.state.currentCol || currentRow > this.state.currentRow){
      // console.log("COl:>>>>>>>>>>>>>>>>", Object.assign({}, this.state.cells))
      // console.log("available::", this.available_item_left_right(currentRow, currentCol))
      let value_to_left = []
      if(!this.available_item_on_old_order(currentRow, currentCol)){
        const search_value = this.when_available_item_left_right(currentRow, currentCol)
        if(search_value){
          currentRow = search_value.defaultRow
          currentCol= search_value.defaultColumn
        }
        this.get_item_between_forward(currentRow, currentCol).forEach((value, key_y) => {
          // console.log("get_item_between_forward ;; move_item_left :VALUE:", value)
          this.move_item_left(value, 1)
          count_change += 1
          value_to_left.push(value)
        })
      }
      // console.log("available_item_left_right")
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
      // console.log("back:<<<<<<<<<<<<<<<", Object.assign({}, this.state.cells))
      // console.log("available::", this.available_item_left_right(currentRow, currentCol))
      let value_to_right = []
      if(!this.available_item_on_old_order(currentRow, currentCol)){
        // console.log("return defaultColumn defaultRow for need item", this.when_available_item_left_right(currentRow, currentCol))
        const search_value = this.when_available_item_left_right(currentRow, currentCol)
        if(search_value){
          currentRow = search_value.defaultRow
          currentCol= search_value.defaultColumn
        }
        this.get_item_between_back(currentRow, currentCol).forEach((value, key_y) => {
          // console.log("value::", value)
          this.move_item_right(value, 1)
          count_change += 1
          value_to_right.push(value)
        })
      }
      if(this.available_item_left_right(currentRow, currentCol)){
        this.move_item_on_current_row_col(currentRow, currentCol)
        count_change += 1
      }else{
        // console.log("return defaultColumn defaultRow for need item", this.when_available_item_left_right(currentRow, currentCol))
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

  onHandleTouchMove = (e) => {
    // console.log("onHandleTouchMove")
    if(!this.state.isGridLocked){
      e.preventswipe();
      this.onHandleMouseMove(e.touches[0]);
    }
  }

  onHandleMouseMove = ({pageX, pageY}) => {
    if(!this.state.isGridLocked){
      // if(this.state.isPressed){
        // console.log("handleMouseMove pageX, pageY", pageX, pageY)
        this.handleMouseMove({pageX, pageY})

        // let st = this.get_state()
        // this.setState({mouseY: st.mouseY, mouseX: st.mouseX, cells: st.cells });
      // }
    }
  };

  onHandleMouseDown = (pos, [pressX, pressY], {pageX, pageY}) => {
    if(!this.state.isGridLocked){
      // console.log("handleMouseDown:::", pos)
      this.handleMouseDown(pos, [pressX, pressY], {pageX, pageY})
      // let st = this.sortable.get_state()
      if(this.state.onCellDragStart){
        // console.log("onCellDragStart:::")
        this.state.onCellDragStart(pos)
      }
      // this.setState({
      //   lastPress: pos,
      //   isPressed: st.isPressed,
      //   mouseY: st.mouseY,
      //   mouseX: st.mouseX
      // });
    }
  };

  onHandleMouseUp = () => {
    if(!this.state.isGridLocked){
      // console.log("handleMouseUp:::")
      let is_call_callback = false
      if(
        this.state.onCellDrop //&&
        //JSON.stringify(this.sortable.state.cells) !== JSON.stringify(this.sortable.state.old_order)
      ){
        is_call_callback = true
      }

      this.handleMouseUp()
      let st = this.get_state()

      if(is_call_callback){
        this.state.onCellDrop(st)
        // console.log("sortable.get_state()", st)
      }

      // this.setState({
      //   isPressed: st.isPressed,
      // });
    }
  };

  handleMouseMove({pageX, pageY}){
    const {isPressed, topDeltaY, topDeltaX} = this.state;

    if (isPressed) {
      let copy = Object.assign({}, this.state);
      const mouseY = pageY - topDeltaY ;
      const currentRow = this.clamp(Math.round(mouseY / (this.state.cellHeight+this.state.cellSpacing)), 1, 10);

      const mouseX = pageX - topDeltaX;
      const currentCol = this.clamp(Math.round(mouseX / (this.state.cellWidth+this.state.cellSpacing)), 1, this.get_right_column_average(currentRow));

      // console.log("currentRow::", currentRow)
      // console.log("currentCol::", currentCol)

      let new_row = []
      new_row = copy.cells

      if(this.state.mode === "SWAP"){
        this.state.count_change = this.default_Sortable(currentRow, currentCol)
      }
      if(this.state.mode === "SORT"){
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
      this.state.cells = new_row

      this.state.handleMouseMove({pageX, pageY, st:this.state})

    }
  }

  handleMouseDown(pos, [pressX, pressY], {pageX, pageY}){
    this.state.lastPress = pos
    this.state.isPressed = true
    this.state.mouseY = pressY
    this.state.mouseX = pressX
    // let copy = Object.assign({}, this.state);
    // this.state.old_order = copy.cells;
    // console.log("this.state.old_order:::", this.state.old_order)
    this.state.old_order = this.clone(this.state.cells)
    this.state.topDeltaY = pageY - pressY
    this.state.topDeltaX = pageX - pressX

    this.state.handleMouseDown(pos, [pressX, pressY], {pageX, pageY})

  }

  handleMouseUp(){
    this.state.isPressed = false
    this.state.topDeltaY = 0
    this.state.topDeltaX = 0
    this.state.currentCol = null
    this.state.currentRow = null
    this.state.old_order = this.clone(this.state.cells)

    this.state.handleMouseUp()

  }
}

export default Sortable;
