module BonsaiHelper
  def bonsai expr, data={}
    BonsaiTree.new( expr, data ).to_s
  end
  alias :bsai :bonsai
end