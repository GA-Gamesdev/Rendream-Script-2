

  /**
   * @hidden
   */
const canvas = document.getElementById("RDS2GameCanvas")
  /**
   * @hidden
   */
const ctx = canvas.getContext("2d")


  /**
   * @hidden
   */
let gravity = 1

  /**
   * @hidden
   */
let HorsDamp = 0.85

  /**
   * @hidden
   */
let VertDamp = 1

  /**
   * @hidden
   */
let bgcolor = "#FFFFFF"

  /**
   * @hidden
   */
let RDM = {

}
  /**
   * @hidden
   */
let ROU
  /**
   * @hidden
   */
let input = {}

  /**
   * @hidden
   */
let frameinput = {}

  /**
   * @hidden
   */
let RDMS = {}



let cam = {
    x:0,
    y:0,
  width:canvas.height,
  height:canvas.width,
  tx:0,
  ty:0
}

/**
 * @typedef {object} GameObjectParameters
 * @property {number} width - Width of the GameObject.
 * @property {number} height - Height of the GameObject.
 * @property {number} x - X position of the GameObject.
 * @property {number} y - Y position of the GameObject.
 * @property {RDS2image} spr - What the GameObject renders.
 * @property {boolean} ApplyPhysics - Turn on/off gravity effect on GameObject.
 * @property {boolean} hitbox - Turn on/off collison on GameObject.
 * @property {boolean} Collidable - Turn on/off solid GameObject state. REQUIRES GameObject.hitbox TO BE TRUE
 * @property {string} square - draws a square rather than a sprite with the string being the color
 * @property {string} text - draws text rather than a sprite with the string being the displayed text
 * @property {string} textcolor - change text element color. REQUIRES GameObject.text
 * @property {string} textsize - change text element size. REQUIRES GameObject.text

*/



/**
 * Main Rendream engine API.
 * @namespace
 */
 export const Rendream = {
            /**
     * runs `callback` every frame.
     * @param {callback} callback - code to run.

     */
OnUpdate(callback){
    ROU = callback
},
/**
 * Rendream Prefab Library.
 * @namespace
 */
Prefabs:{

},



    /**
 * Main Rendream engine rendering and canvas.
 * @namespace
 */
    Game:{
            /**
     * Sets up the rendering canvas.
     * @param {number} canvasw - Canvas width in pixels.
     * @param {number} canvash - Canvas height in pixels.
     */
        SetupCanvas(canvasw,canvash){
            if(canvas){
            canvas.width = canvasw
            canvas.height = canvash
            }
        },



          /**
   * @hidden
   */
        ClearScene(){
            RDM = {}
            cam.x = 0
            cam.y = 0
            cam.tx = 0
            cam.ty = 0
            ROU = null
        },
                            /**
     * Creates a scene
     * @param {string} name - scene name.
     * @param {callback} callback - scene code.

     */
        NewScene(name,callback){
            RDMS[name] = callback
        },
                                    /**
     * loads a scene
     * @param {string} name - scene name.


     */
        LoadScene(name){
            Rendream.Game.ClearScene()
            RDMS[name]()
        },

                                            /**
     * returns true if key is down on frame
     * @param {object} target - Object to target.
     * @param {boolean} smooth - turn on/off camera smoothing.
     * @param {number} vlu - time to reach player (only works if smoothing on).
     */
        updateCam(target, smooth, vlu){
  if(!smooth){
  cam.x = (target.x + target.width /2) - (canvas.width / 2)
    cam.y = (target.y + target.height /2) - (canvas.height / 2)
    

  }else{

      cam.tx = (target.x + target.width /2) - (canvas.width / 2)
    cam.ty = (target.y + target.height /2) - (canvas.height / 2)

    cam.x += (cam.tx - cam.x) * vlu; 
      cam.y+= (cam.ty - cam.y) * vlu; 
  }
},
                                            /**
     * sets background color
     * @param {string} color - background color.

     */
SetBackground(color){
    bgcolor = color
},



    },
    /**
 * Main Rendream engine API.
 * @namespace
 */
    Objects:{


                         /**

     * @param {GameObjectParameters} Params - Parameters of a GameObject.

     */
        CreateObject(Params){
            const ID = Object.values(RDM)

            const GameObject = Object.assign(Params,{

ID:ID,

                                         /**

     * @param {number} dx - amount of X force applied to GameObject.
     * @param {number} dy - amount of Y force applied to GameObject.
     * 
     

     */
                move(dx,dy){
                    this.vx += dx
                    this.vy += dy
                },
                                                         /**

     * @param {number} force - amount of jump force applied to GameObject.
     * 
     * Requires: ApplyPhysics: true

     */
                jump(force){
                  this.vy = -force
                  this.isGrounded = false
                },

                                                                         /**

  
     * 
     * Deletes GameObject

     */
                Delete(){
                    delete RDM[this.ID]
                }
            })

            RDM[ID] = GameObject
            return GameObject
        },

                                                         /**
     * checks if 2 objects are colliding
     * @param {GameObject} a - GameObject A for checking collision.
     * @param {GameObject} b - GameObject B for checking collision.
     * 
     * Requires: hitbox = true

     */

         CheckCollision(a,b){
    if(a && b && a.hitbox && b.hitbox){

      const aw = a.width
      const ah = a.height

            const bw = b.width
      const bh = b.height

let lo = a.x+aw-b.x
let ro = b.x + bw - a.x
let uo = a.y + ah - b.y
let dov = b.y +bh - a.y

let min = Math.min(lo,ro,uo,dov)

let midplat = b.x+bw/2
let midplr = a.x + (aw/2)

if(a.x+aw >= b.x && a.x <= b.x+bw && a.y + ah - b.y > 0 && b.y +bh - a.y > 0){

  if(min === lo){

return "left"
  }else if(min === ro){


return "right"

  }else if(min === uo){

return "top"
  }else if(min === dov){


return "bottom"
  }
  



}
      }
    
},

                                                         /**
     * checks if 2 objects are colliding and runs code
     * @param {GameObject} a - GameObject A for checking collision.
     * @param {GameObject} b - GameObject B for checking collision.
     * @param {callback} callback - code to run if Gameobject A and B are colliding.
     * Requires: hitbox = true

     */

 OnCollision(a,b,callback){
 
        if(Rendream.Objects.CheckCollision(a,b)){
            callback()
        }
    
},
                            /**
     * create and save a new premade object to use though-out all scenes.
    
     * @param {string} name - New prefab name.
     * * @param {data} object - Object being made a prefab.

     */
CreatePrefab(name,object){
    Prefabs[name] = object
},
                            /**
     * spawn a Prefab object.
     * @param {string} name - Spawn prefab.

     */
SpawnPrefab(name){
    Prefabs[name]()
},


    },
    /**
 * Main Rendream engine asset management system.
 * @namespace
 */
    Assets:{
                         /**

     * @param {string} ObjectName - name of RDS2 image object.
     * @param {File} Data - location of image file.
     * 
     * Creates an RDS2 Image Object

     */
        
        LoadSprite(ObjectName, Data){
            if(!ObjectName){
                console.error("no object name was added to LoadSprite()")
                return
            }
            if(Data){
                let sprite = new Image()
                sprite.src = Data
                if(!sprite.src){
                       console.error("No image data may be corrupted or invalid")
                       return
                }

                Rendream.Assets.Sprites[ObjectName] = sprite

            }else{
                console.error("No image data was Provided to load")
                return
            }
        },

            /**
 * Sprite management system.
 * 
 * `Rendream.Assets.Sprites.[RDS2 Image Object]`
 * @namespace
 */
            Sprites:{

    },


    
    },
/** 
     * Main Rendream engine Save Data management system.
 * @namespace
 */
Storage:{
                                /**
     * Saves game data
     * @param {string} key - Storage key.
     * @param {any} data - Data to save.

     */
    SaveData(key,data){
        localStorage.setItem(key,data)
    },
                                    /**
     * load game data
     * @param {string} key - Storage key.


     */
    LoadData(key){
        return localStorage.getItem(key)
    },


},

/** 
     * Main Rendream engine Input management system.
 * @namespace
 */
    Input:{
                            /**
     * returns true if key is down
     * @param {string} key - key.

     */
        IsKeyDown(key){
            if(input[key]){
                return true
            }
        },
                                    /**
     * returns true if key is not down
     * @param {string} key - key.

     */
                IsKeyUp(key){
            if(!inputs[key]){
                return true
            }
        },
                                    /**
     * returns true if key is down on frame
     * @param {string} key - key.

     */
                OnKeyDown(key){
            if(frameinput[key]){
                return true
            }
        },
    },
    /** 
     * Main Rendream engine Physics engine functions and properties.
 * @namespace
 */
    Physics:{
                    /**
     * Change world gravity.
     * default gravity is 1
     * @param {number} Gravity - Gravity scale.

     */
        SetGravity(Gravity){
            gravity = Gravity
        },

                            /**
     * Change world X velocity dampining.
     * default value is 0.85
     * @param {number} value - X Velocity dampining scale.

     */
        SetXVelocityDampining(value){
            HorsDamp = value
        },
        
                                    /**
     * Change world Y velocity dampining.
     * default value is 1
     * @param {number} value - Y Velocity dampining scale.

     */

              SetYVelocityDampining(value){
            VertDamp = value
        }
    }



}

  /**
   * @hidden
   */
function draw(){

    
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0,0,canvas.width,canvas.height)
  ctx.fillStyle = bgcolor
  ctx.fillRect(0,0,canvas.width,canvas.height)
  ctx.translate(-cam.x, -cam.y)
  
   if(ROU){
        ROU()
    }

Object.values(RDM).forEach(GameObject => {
if(GameObject.Fixed){
                         if(GameObject.ApplyPhysics || GameObject.Collidable){
        GameObject.ApplyPhysics = false
        GameObject.Collidable = false
        console.warn("RDS2 physics engine doesnt work for Fixed GameObjects, these were automaticaly set to false")
        
    
                     }

}


    if(!GameObject.Fixed){

    if(GameObject.spr && GameObject.spr.complete){
               if(GameObject.textcolor){
            console.warn("text color is not supported on GameObjects of this kind")
                }
                               if(GameObject.textsize){
            console.warn("text size is not supported on GameObjects of this kind")
                }
    ctx.drawImage(GameObject.spr, GameObject.x, GameObject.y, GameObject.width, GameObject.height)
    }
        if(GameObject.square){
                if(GameObject.textcolor){
            console.warn("text color is not supported on GameObjects of this kind")
                }
                   if(GameObject.textsize){
            console.warn("text size is not supported on GameObjects of this kind")
                }
            ctx.fillStyle = GameObject.square
    ctx.fillRect(GameObject.x, GameObject.y, GameObject.width, GameObject.height)
    }

            if(GameObject.text){

                         if(GameObject.ApplyPhysics || GameObject.Collidable || GameObject.hitbox){
        GameObject.ApplyPhysics = false
        GameObject.Collidable = false
        GameObject.hitbox = false
        console.warn("RDS2 physics/collision engine doesnt work for text GameObjects, these were automaticaly set to false")
        
    
                     }

            if(GameObject.width || GameObject.height){
   
        console.warn("GameObject.width / GameObject.height properties don't work for text GameObjects, these were automaticaly set to false")
        
    
                     }

                if(GameObject.textcolor){
            ctx.fillStyle = GameObject.textcolor
                }else{
                    ctx.fillStyle = "#000000"
                }
                                if(GameObject.textsize){
            ctx.font = `${GameObject.textsize}px Arial`
                }else{
                    ctx.font = `25px Arial`
                }

                
    ctx.fillText(GameObject.text,GameObject.x, GameObject.y)
    }

            if(GameObject.vy === undefined){
        GameObject.vy = 0
    }
                if(GameObject.vx === undefined){
        GameObject.vx = 0
    }





     GameObject.x += GameObject.vx
    GameObject.vx *= HorsDamp

    if(GameObject.vx <= 0.66 && GameObject.vx >= -0.66){
        GameObject.vx = 0
    }


if(GameObject.Collidable && !GameObject.hitbox){
    GameObject.hitbox = true
    console.warn("GameObject.Collidable was set to true while GameObject.hitbox was false. GameObject.hitbox was turned on automaticaly")
}
  
 

    if(GameObject.hitbox && GameObject.ApplyPhysics){
        Object.values(RDM).forEach(OtherObject => {
            if(OtherObject === GameObject || !OtherObject.hitbox || !GameObject.hitbox){
                return
            }

            if(!OtherObject.Collidable){
                return
            }

            const side = Rendream.Objects.CheckCollision(GameObject,OtherObject)

 
                                    if(side === "left"){
                GameObject.x = OtherObject.x - GameObject.width 
                GameObject.vx = 0
  
            }
                                    if(side === "right"){
                GameObject.x = OtherObject.width + OtherObject.x
                GameObject.vx = 0
  
            }

        })
    }





      if(GameObject.ApplyPhysics){

        if(GameObject.vy < 20){
        GameObject.vy += gravity
        }
    }

    GameObject.y += GameObject.vy
 

    if(GameObject.hitbox){
        Object.values(RDM).forEach(OtherObject => {
            if(OtherObject === GameObject || !OtherObject.hitbox || !GameObject.hitbox){
                return
            }

                if(!OtherObject.Collidable){
                return
            }

            const side = Rendream.Objects.CheckCollision(GameObject,OtherObject)

 
                    if(side === "top"){
                GameObject.y = OtherObject.y - GameObject.height
                GameObject.vy = 0
                GameObject.isGrounded = true
            }
                        if(side === "bottom"){
                GameObject.y = OtherObject.y+OtherObject.height
                GameObject.vy = 0
  
            }
        })
        }    
}

})

    
            
        

        
    
        Object.values(RDM).forEach(GameObject => {
            if(GameObject.Fixed){
                 ctx.setTransform(1, 0, 0, 1, 0, 0);

                     if(GameObject.ApplyPhysics || GameObject.Collidable){
        GameObject.ApplyPhysics = false
        GameObject.Collidable = false
        console.warn("RDS2 physics engine doesnt work for Fixed GameObjects, these were automaticaly set to false")
        
    
                     }

                     if(GameObject.spr && GameObject.spr.complete){
    ctx.drawImage(GameObject.spr, GameObject.x, GameObject.y, GameObject.width, GameObject.height)
    }
        if(GameObject.square){
            ctx.fillStyle = GameObject.square
    ctx.fillRect(GameObject.x, GameObject.y, GameObject.width, GameObject.height)
    }
     if(GameObject.text){

                         if(GameObject.ApplyPhysics || GameObject.Collidable || GameObject.hitbox){
        GameObject.ApplyPhysics = false
        GameObject.Collidable = false
        GameObject.hitbox = false
        console.warn("RDS2 physics/collision engine doesnt work for text GameObjects, these were automaticaly set to false")
        
    
                     }

            if(GameObject.width || GameObject.height){
   
        console.warn("GameObject.width / GameObject.height properties don't work for text GameObjects, these were automaticaly set to false")
        
    
                     }

                if(GameObject.textcolor){
            ctx.fillStyle = GameObject.textcolor
                }else{
                    ctx.fillStyle = "#000000"
                }
                                if(GameObject.textsize){
            ctx.font = `${GameObject.textsize}px Arial`
                }else{
                    ctx.font = `25px Arial`
                }

                
    ctx.fillText(GameObject.text,GameObject.x, GameObject.y)
    }


}
})
  /**
   * @hidden
   */
  frameinput = {}

}

  /**
   * @hidden
   */
let lasttime = performance.now()
  /**
   * @hidden
   */
let accumulator = 0;
  /**
   * @hidden
   */
const deltatime = 1000/60
  /**
   * @hidden
   */
function redrawframe(ts){

if (!ts){
  ts = performance.now()
}
let frametime = ts - lasttime
lasttime = ts

if(frametime > 250) frametime = 250

accumulator += frametime

while(accumulator >= deltatime){
 draw()
 accumulator-=deltatime
}

  requestAnimationFrame(redrawframe)
}
  requestAnimationFrame(redrawframe)

window.addEventListener("keydown",(event)=>{

  

  if(!event.repeat && !input[event.key]){
    frameinput[event.key] = true
}

input[event.key] = true

})




window.addEventListener("keyup",(event)=>{
input[event.key] = false
})

window.addEventListener("mousedown",(e)=>{
  if(e.button===0)input["LMouse"] = true
})

window.addEventListener("mouseup",(e)=>{
  if(e.button===0)input["LMouse"] = false
})

