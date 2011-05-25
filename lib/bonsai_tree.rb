# A BonsaiTree encapsulates:
#  - an array of views which will call each other in outer-to-inner order
#  - a hash map of name-value pairs, possibly nested, to supply data for rendering
#  - a 'final' data object to insert at the graft-point of the inner-most view
class BonsaiTree
  attr_accessor :expr, :data, :renderers
  
  def initialize( expr, data )
    self.expr, self.data = expr, data
    self.renderers = {}
    
    def renderers.bold
      "<b>#{yield}</b>"
    end
    def renderers.italic
      "<i>#{yield}</i>"
    end
  end

  def to_s opts={}
    render opts
  end
  
  # private

  def render opts={}
    
    data_proc= lambda{ data }
    result = ""
    view_names.reverse.each do |vn|
      result = self.renderers.send vn, &data_proc
      data_proc= lambda{ result }
    end
    result
  end
  
  # returns the list, from outer to inner, of views this expression references
  def view_names
    expr.split %r{[()]}
  end
  
  
end