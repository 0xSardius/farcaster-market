"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useUser } from "@/context/UserContext";
import { getUserActivity, getUserFavorites } from "@/lib/supabase";
import type { Activity, UserFavorite } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WalletConnect } from "@/components/WalletConnect";
import { ArrowLeft, Heart, ShoppingBag, Share2, Eye } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { isConnected } = useAccount();
  const { dbUser } = useUser();
  const [activity, setActivity] = useState<Activity[]>([]);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [activeTab, setActiveTab] = useState<"activity" | "favorites">(
    "activity",
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!dbUser) return;

      setIsLoading(true);
      try {
        const [activityData, favoritesData] = await Promise.all([
          getUserActivity(dbUser.id),
          getUserFavorites(dbUser.id),
        ]);
        setActivity(activityData || []);
        setFavorites(favoritesData || []);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [dbUser]);

  const getActivityIcon = (type: Activity["activity_type"]) => {
    switch (type) {
      case "purchase":
        return <ShoppingBag className="w-4 h-4" />;
      case "listing":
        return <ShoppingBag className="w-4 h-4" />;
      case "share":
        return <Share2 className="w-4 h-4" />;
      case "like":
        return <Heart className="w-4 h-4" />;
      case "view":
        return <Eye className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: Activity["activity_type"]) => {
    switch (type) {
      case "purchase":
        return "text-green-600";
      case "listing":
        return "text-blue-600";
      case "share":
        return "text-purple-600";
      case "like":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isConnected || !dbUser) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b-4 border-black bg-white p-4">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="noShadow" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-black uppercase">PROFILE</h1>
          </div>
        </header>

        <div className="p-4 text-center py-12">
          <p className="font-black uppercase mb-4">NOT CONNECTED</p>
          <p className="text-sm mb-4">
            Connect your wallet to view your profile
          </p>
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-4 border-black bg-white p-4">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="noShadow" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-black uppercase">PROFILE</h1>
        </div>
      </header>

      {/* User Info */}
      <div className="p-4 border-b-4 border-black bg-secondary">
        <div className="flex items-center space-x-4">
          {dbUser.pfp_url && (
            <img
              src={dbUser.pfp_url}
              alt={dbUser.username}
              className="w-16 h-16 rounded-full border-4 border-black"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-black">
              {dbUser.display_name || dbUser.username}
            </h2>
            <p className="text-sm text-gray-600 mb-1">@{dbUser.username}</p>
            {dbUser.bio && (
              <p className="text-sm text-gray-700 line-clamp-2">{dbUser.bio}</p>
            )}
            <div className="flex items-center space-x-4 mt-2">
              <div className="text-xs">
                <span className="font-black">FID:</span> {dbUser.fid}
              </div>
              {isConnected && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-black">CONNECTED</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b-2 border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-black">{activity.length}</p>
            <p className="text-xs uppercase text-gray-600">ACTIVITIES</p>
          </div>
          <div>
            <p className="text-lg font-black">{favorites.length}</p>
            <p className="text-xs uppercase text-gray-600">FAVORITES</p>
          </div>
          <div>
            <p className="text-lg font-black">
              {activity.filter((a) => a.activity_type === "purchase").length}
            </p>
            <p className="text-xs uppercase text-gray-600">PURCHASES</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-4 border-b-2 border-gray-200">
        <div className="flex space-x-2">
          <Badge
            variant={activeTab === "activity" ? "default" : "neutral"}
            className="font-black uppercase cursor-pointer"
            onClick={() => setActiveTab("activity")}
          >
            ACTIVITY
          </Badge>
          <Badge
            variant={activeTab === "favorites" ? "default" : "neutral"}
            className="font-black uppercase cursor-pointer"
            onClick={() => setActiveTab("favorites")}
          >
            FAVORITES
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="font-black uppercase">LOADING...</p>
          </div>
        ) : activeTab === "activity" ? (
          <div className="space-y-3">
            {activity.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-black uppercase mb-2">NO ACTIVITY YET</p>
                <p className="text-sm text-gray-600">
                  Start trading to see your activity here
                </p>
              </div>
            ) : (
              activity.map((item) => (
                <Card key={item.id} className="border-2 border-black">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className={getActivityColor(item.activity_type)}>
                        {getActivityIcon(item.activity_type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">
                          {item.activity_type.toUpperCase()}{" "}
                          {item.nft_name || `Token #${item.nft_token_id}`}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.collection_name} •{" "}
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                        {item.price_eth && (
                          <p className="text-xs font-black text-primary">
                            {item.price_eth} ETH
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-black uppercase mb-2">NO FAVORITES YET</p>
                <p className="text-sm text-gray-600">
                  Like NFTs while browsing to see them here
                </p>
              </div>
            ) : (
              favorites.map((item) => (
                <Card key={item.id} className="border-2 border-black">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-bold text-sm">
                          Token #{item.nft_token_id}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-16"></div>
    </div>
  );
}
