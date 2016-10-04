require "./vis/*"
require "kemal"
require "http/client"

module Vis
  
  public_folder "src/public"

  # main app
  get "/" do |env|
    env.response.headers["Access-Control-Allow-Origin"] = "*"
    render "src/views/index.ecr"
  end

  # get a random song in JSON from clyp.it
  get "/search/:query" do |env|
    env.response.headers["Access-Control-Allow-Origin"] = "*"
    query = env.params.url["query"]
    env.response.content_type = "application/json"
    json = HTTP::Client.get "https://api.clyp.it/search?type=hashtag&query=#{query}"
    json.body
  end

  # hack to get around cors Access
  get "/song/:id" do |env|
    env.response.headers["Access-Control-Allow-Origin"] = "*"
    env.response.content_type = "audio/mpeg"
    id = env.params.url["id"]
    file = HTTP::Client.get "http://a.clyp.it/#{id}"
    file.body
  end

  Kemal.run
end
