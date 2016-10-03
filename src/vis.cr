require "./vis/*"
require "kemal"
require "http/client"

module Vis
  
  public_folder "src/public"

  # main app
  get "/" do
    render "src/views/index.ecr"
  end

  # get a random song in JSON from clyp.it
  get "/search/:query" do |env|
    query = env.params.url["query"]
    env.response.content_type = "application/json"
    json = HTTP::Client.get "https://api.clyp.it/search?type=hashtag&query=#{query}"
    json.body
  end

  Kemal.run
end
