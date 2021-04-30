import fs                       from 'fs-extra'
import cli                      from 'cli'
import os                       from 'os'
import path, { ParsedPath }     from 'path'
import prompt                   from 'prompt'

prompt.start()

/**
 * Parse input
 */
cli.parse({
    location: [ false, 'The target folder location of the files to rename', 'string', '' ],
    remove: [ false, 'The string to remove from the file name', 'string', '' ],
    replace: [ false, 'The optional string to replace with the text removed', 'string', '' ],
    write: [false, 'The optional write location for the new files, (defaults to Desktop)', 'string', '']
})


/**
 * Add additional delay to process
 * @param time 
 * @returns 
 */
const wait = (time: number = 300): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    })
}

/**
 * Run rename
 */
const doRename = async (args: Array<string>, options: any) => {
    if(options.location == '') return cli.fatal('Folder of files to rename must be provided - use --location')
    if(options.remove == '') return cli.fatal('Test to remove must be provided - use --remove')
    
    cli.info(`Quick Rename v1.0.0`)
    await wait()

    let desktop     : string        = path.join(os.homedir(), 'Desktop')
    let location    : string        = options.location
    let remove      : string        = options.remove
    let replace     : string        = options.replace
    let folder      : ParsedPath    = path.parse(location)
    let folderName  : string        = folder.base
    let write       : string        = options.write != '' ? options.write : path.join(desktop, `${folderName}-renamed`)

    let filesToIgnore: Array<string> = ['.DS_Store']

    cli.info(`Using directory '${location}'`)
    await wait()

    fs.readdir(location, async (err, found) => {
        if(err) cli.fatal(err.message)

        // Files to test
        let files: Array<string> = found.filter(i => !filesToIgnore.includes(i))
        cli.info(`Found ${files.length} files in folder`)
        await wait()

        // Make directory on desktop
        cli.info(`Copying renamed files to ${write}`)
        await wait()

        // Create destination folder
        await fs.ensureDir(write)

        for(let file of files) {
            try {
                // Setup source
                let srcPath : string = path.join(location, file)
                let renamed : string = String(file).replace(remove, replace)

                // Setup destination
                let destPath: string = path.join(write, renamed)
                await fs.copyFile(srcPath, destPath)
                cli.info(`Renamed '${file}' to '${renamed}'`)
            } catch(e) {
                cli.error(e.message)
            }
            await wait()
        }
    })
}


/**
 * Check user is happy to continue
 */
let schema: any = {
    properties: {
        agree: {
            description: 'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n\nPlease enter Y to continue...',
            message: 'Must be Y',
            type: 'string',
            required: true
        }
    }
}

prompt.get(schema).then(res => {
    if(res.agree !== 'Y') cli.fatal(`You must agree to continue`)

    /**
     * Begin cli
     */
    cli.main(doRename)
})