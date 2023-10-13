<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Branch;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class RemoveImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $images = Storage::disk('public')->allFiles();
        foreach($images as $image) {
            if($image != '.gitignore') {
                $admin = Admin::where('avatar', $image)->get()->count();
                $product = ProductImage::where('src', 'LIKE', $image)->get()->count();
                $branch = Branch::where('image', $image)->get()-> count();

                if($admin == 0 && $product == 0 && $branch == 0) {
                    Storage::disk('public')->delete($image);
                    echo $image . PHP_EOL;
                }
            }
        }
    }
}