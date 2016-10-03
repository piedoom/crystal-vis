require "./vis/*"
require "kemal"

module Vis
  
  public_folder "src/public"

  get "/" do
    render "src/views/index.ecr"
  end

  Kemal.run
end
