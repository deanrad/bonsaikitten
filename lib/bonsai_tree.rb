# A BonsaiTree encapsulates:
#  - an array of views which will call each other in outer-to-inner order
#  - a hash map of name-value pairs, possibly nested, to supply data for rendering
#  - a 'final' data object to insert at the graft-point of the inner-most view
class BonsaiTree
  attr_accessor :expr, :data, :renderer
  
  def initialize( expr, data )
    self.expr, self.data = expr, data
    self.renderer = {}

    # set up the renderer, so that the bonsai expr can, with a few mods,
    # be a valid ruby expression inside of it.
    renderer.instance_variable_set("@data", data)
    
    # LEFTOFF, look these methods up in a BonsaiGarden, and only define a method
    # once per view per process, even if the method gets bound to multiple obj.
    def renderer.bold
      "<b>#{yield if block_given?}</b>"
    end
    def renderer.italic
      "<i>#{yield if block_given?}</i>"
    end
  end

  def to_s opts={}
    render opts
  end
  
  # private

  # We hack the bonsai expression into an evalable string. Lame.
  def render opts={}
    # italic(bold) => italic{ bold{ data }}, then evaled
    expr = self.expr.gsub("(", "{").gsub(")", "}")
    
    if expr.include?('{')
      expr.sub!( "}", "{@data}}")
    else
      expr << "{@data}"
    end
    self.renderer.instance_eval expr
  end
  
  # returns the list, from outer to inner, of views this expression references
  def view_names
    expr.split %r{[()]}
  end
  
  
end